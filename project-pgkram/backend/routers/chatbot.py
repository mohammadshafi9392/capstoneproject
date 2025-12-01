from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from datetime import datetime
import json
import uuid

from ai_service import ai_service
from database import db_manager
from models import ChatMessage, ChatResponse

router = APIRouter(tags=["chatbot"])


# ----------------- HTTP Chat Endpoint -----------------
@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatMessage):
    """HTTP endpoint for chat (fallback)"""
    try:
        # Ensure session exists or create new one
        session_id = request.session_id or str(uuid.uuid4())
        await ensure_session_exists(session_id)

        # Generate AI response
        response = await ai_service.generate_response(request.message, session_id)

        # Save both user and bot messages
        await db_manager.save_chat_message(session_id, "user", request.message)
        await db_manager.save_chat_message(session_id, "bot", response)

        return ChatResponse(
            success=True,
            message=response,
            session_id=session_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


# ----------------- WebSocket Chat Endpoint -----------------
@router.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time chat"""
    manager = WebSocketConnectionManager()
    await manager.connect(websocket, session_id)

    try:
        # Ensure chat session exists in DB
        await ensure_session_exists(session_id)

        # Send welcome message
        welcome_message = await ai_service.get_general_info()
        await manager.send_personal_message(json.dumps({
            "type": "bot_message",
            "message": welcome_message,
            "timestamp": datetime.now().isoformat()
        }), session_id)

        # Handle incoming chat messages
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data.get("type") == "user_message":
                user_message = message_data.get("message", "")

                # Save user message
                await db_manager.save_chat_message(session_id, "user", user_message)

                # Typing indicator
                await manager.send_personal_message(json.dumps({
                    "type": "typing",
                    "message": "AI is thinking...",
                    "timestamp": datetime.now().isoformat()
                }), session_id)

                # Generate AI response
                ai_response = await ai_service.generate_response(user_message, session_id)

                # Save bot message
                await db_manager.save_chat_message(session_id, "bot", ai_response)

                # Send bot reply
                await manager.send_personal_message(json.dumps({
                    "type": "bot_message",
                    "message": ai_response,
                    "timestamp": datetime.now().isoformat()
                }), session_id)

    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        print(f"❌ Error in WebSocket: {e}")
        manager.disconnect(session_id)


# ----------------- WebSocket Connection Manager -----------------
class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_personal_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)


# ----------------- Chat History Endpoint -----------------
@router.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 20):
    """Get chat history for a session"""
    try:
        await ensure_session_exists(session_id)
        history = await db_manager.get_chat_history(session_id, limit)
        return {
            "success": True,
            "data": history,
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat history: {str(e)}")


# ----------------- Helper: Ensure Session Exists -----------------
async def ensure_session_exists(session_id: str):
    """Create a chat session if it doesn't already exist"""
    existing = await db_manager.fetch_one(
        "SELECT session_id FROM chat_sessions WHERE session_id = $1", session_id
    )
    if not existing:
        await db_manager.execute_insert(
            "INSERT INTO chat_sessions (session_id, user_ip) VALUES ($1, $2) RETURNING session_id",
            session_id,
            "127.0.0.1"  # you can replace with actual client IP if needed
        )
        print(f"🆕 Created new session: {session_id}")
