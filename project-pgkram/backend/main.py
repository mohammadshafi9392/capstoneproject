from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from config import ALLOWED_ORIGINS
from database import db_manager
from routers.analytics import router as analytics_router
from routers.chatbot import router as chatbot_router
from routers.jobs import router as jobs_router
from routers.auth import router as auth_router

# Initialize FastAPI app
app = FastAPI(
    title="Punjab Job Portal Chatbot API",
    description="AI-powered chatbot for job search assistance",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    await db_manager.create_pool()
    await db_manager.create_chat_tables()
    await db_manager.create_user_table()
    await db_manager.create_job_support_tables()
    print("Chatbot API started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    await db_manager.close_pool()
    print("API stopped")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Punjab Naukari Chatbot API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "chat": "/api/chat",
            "websocket": "/ws/chat/{session_id}",
            "jobs": "/api/jobs/search",
            "stats": "/api/jobs/stats"
        }
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected",
        "ai_service": "active"
    }

# Routers
app.include_router(analytics_router)
app.include_router(chatbot_router)
app.include_router(jobs_router)
app.include_router(auth_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


