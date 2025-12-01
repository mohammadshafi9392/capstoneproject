import { apiRequest } from '../utils/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function sendChatMessage(message, sessionId, signal) {
  try {
    return await apiRequest(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
      signal,
    }, 30000); // Longer timeout for chat requests
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError as-is
    }
    throw new Error(`Failed to send chat: ${error.message}`);
  }
}

export function getWebSocketUrl(sessionId) {
  const base = (BASE_URL || '').replace('http', 'ws');
  return `${base}/ws/chat/${sessionId}`;
}

