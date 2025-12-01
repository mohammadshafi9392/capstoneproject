# 🤖 Punjab Job Portal AI Chatbot

A beautiful, intelligent chatbot integrated into your Punjab Job Portal that helps users find jobs using AI-powered natural language processing.

## ✨ Features

- **🧠 AI-Powered**: Uses OpenAI GPT-3.5 for intelligent responses
- **💬 Real-time Chat**: WebSocket-based instant messaging
- **🔍 Smart Job Search**: Understands natural language queries
- **🗄️ Database Integration**: Connected to your PostgreSQL job database
- **📱 Beautiful UI**: Modern, responsive chat interface
- **🎯 Context Aware**: Remembers conversation history
- **🌐 Always Available**: Chatbot on every page of your portal

## 🏗️ Architecture

```
React Frontend (Port 5173) ←→ WebSocket ←→ Python Backend (Port 8000) ←→ PostgreSQL
                                                    ↓
                                            OpenAI GPT-3.5 API
```

## 🚀 Quick Start

### Prerequisites
- ✅ Python 3.8+ installed
- ✅ PostgreSQL running with your job database
- ✅ React app running (already done!)
- ✅ OpenAI API key (already configured!)

### 1. Start the Python Backend

**Option A: Use the batch file (Windows)**
```bash
# Double-click this file:
start_chatbot.bat
```

**Option B: Manual setup**
```bash
cd chatbot-backend
pip install -r requirements.txt
python start_server.py
```

### 2. Your React App is Already Running!
Your React app should be running at `http://localhost:5173` - the chatbot will automatically appear!

### 3. Test the Chatbot
1. Open your React app in the browser
2. Look for the blue chat button in the bottom-right corner
3. Click it to start chatting!

## 🎯 How to Use the Chatbot

### Sample Conversations

**Job Search:**
```
You: "Find government jobs in Ludhiana for graduates"
Bot: "I found several government jobs in Ludhiana for graduates..."

You: "Show me software developer positions with 2-5 years experience"
Bot: "Here are software developer positions matching your criteria..."
```

**Career Guidance:**
```
You: "How do I become a teacher in Punjab?"
Bot: "To become a teacher in Punjab, you need..."

You: "What qualifications do I need for police jobs?"
Bot: "For police positions in Punjab, you typically need..."
```

**General Information:**
```
You: "What jobs are available in Punjab?"
Bot: "Punjab offers a wide range of opportunities..."
```

## 🔧 Configuration

### Environment Variables
The chatbot is pre-configured with:
- **Database**: `postgresql://postgres:tiger@localhost:5432/punjab_job_portal`
- **OpenAI API**: Your API key is already set
- **CORS**: Configured for your React app

### Customization
Edit `chatbot-backend/config.py` to modify:
- System prompts
- Database connection
- API settings
- CORS origins

## 📊 API Endpoints

### Chat API
- **WebSocket**: `ws://localhost:8000/ws/chat/{session_id}`
- **HTTP Chat**: `POST /api/chat`
- **Chat History**: `GET /api/chat/history/{session_id}`

### Job Search API
- **Search Jobs**: `POST /api/jobs/search`
- **Job Statistics**: `GET /api/jobs/stats`
- **Health Check**: `GET /api/health`

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## 🎨 UI Features

### Chat Interface
- **💬 Message Bubbles**: Beautiful user/bot message styling
- **⏳ Typing Indicator**: Shows when AI is thinking
- **🔄 Real-time Updates**: Instant message delivery
- **📱 Responsive Design**: Works on all screen sizes
- **🎭 Minimize/Maximize**: Collapsible chat window

### Chat Controls
- **📤 Send Messages**: Type and press Enter or click send
- **📜 Scroll History**: Auto-scrolls to latest messages
- **🔌 Connection Status**: Shows online/offline status
- **❌ Close Chat**: Hide chat window completely

## 🗄️ Database Schema

### New Tables Created
```sql
-- Chat sessions
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID DEFAULT gen_random_uuid(),
    user_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(session_id),
    message_type VARCHAR(10) CHECK (message_type IN ('user', 'bot')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- User preferences (for future use)
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(session_id),
    job_type VARCHAR(50),
    preferred_districts INTEGER[],
    experience_level VARCHAR(50),
    qualification VARCHAR(100)
);
```

## 🧠 AI Capabilities

### Natural Language Processing
The chatbot can understand:
- **Job Types**: "government jobs", "private sector", "corporate"
- **Qualifications**: "graduate", "post graduate", "12th pass"
- **Experience**: "fresher", "2-5 years", "senior level"
- **Locations**: All 25 Punjab districts
- **Salary**: "high paying", "entry level salary"

### Smart Responses
- **Context Aware**: Remembers conversation history
- **Job Matching**: Finds relevant jobs from database
- **Personalized**: Tailors responses to user needs
- **Helpful**: Provides guidance and tips

## 🔍 Troubleshooting

### Common Issues

**1. WebSocket Connection Failed**
```
Solution: Check if Python backend is running on port 8000
```

**2. Database Connection Error**
```
Solution: Ensure PostgreSQL is running and database exists
```

**3. OpenAI API Error**
```
Solution: Check API key and internet connection
```

**4. Chatbot Not Appearing**
```
Solution: Check browser console for errors, ensure React app is running
```

### Debug Mode
Enable debug logging by setting environment variable:
```bash
export DEBUG=1
python start_server.py
```

## 📈 Performance

### Optimizations
- **Connection Pooling**: Efficient database connections
- **Message Caching**: Reduces API calls
- **WebSocket Compression**: Faster message delivery
- **Database Indexing**: Quick job searches

### Monitoring
- **Health Check**: `GET /api/health`
- **Connection Status**: WebSocket ping/pong
- **Error Logging**: Comprehensive error tracking

## 🔐 Security

### Implemented Security
- **CORS Protection**: Restricted origins
- **Input Validation**: Sanitized user inputs
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: Prevents spam (future feature)

## 🚀 Deployment

### Development
- **Backend**: `http://localhost:8000`
- **Frontend**: `http://localhost:5173`
- **Database**: `localhost:5432`

### Production Ready
The chatbot is production-ready with:
- Error handling
- Logging
- Health checks
- Graceful shutdowns

## 🎉 Success!

Your Punjab Job Portal now has an intelligent AI chatbot that:
- ✅ Understands natural language
- ✅ Searches your job database
- ✅ Provides helpful responses
- ✅ Looks beautiful and professional
- ✅ Works on all pages

## 📞 Support

If you encounter any issues:
1. Check the console logs
2. Verify all services are running
3. Check database connectivity
4. Review API documentation at `/docs`

Happy job searching with AI! 🎯🤖



