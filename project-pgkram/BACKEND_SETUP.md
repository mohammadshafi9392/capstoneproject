# Backend and Database Setup Guide

## Prerequisites

1. **PostgreSQL** installed and running
2. **Python 3.8+** installed
3. **Node.js** installed (for frontend)

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE punjab_job_portal;

-- Exit psql
\q
```

### 1.2 Run Database Schema

```bash
# Navigate to database folder
cd database

# Run the PostgreSQL setup script
psql -U postgres -d punjab_job_portal -f database_setup_postgres.sql
```

## Step 2: Backend Configuration

### 2.1 Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2.2 Create Environment File

```bash
# Copy the example .env file
cp .env.example .env
```

### 2.3 Update .env File

Edit `.env` file with your database credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/punjab_job_portal
GITHUB_TOKEN=your_github_token_here
```

**Note:** Replace `YOUR_PASSWORD` with your PostgreSQL password.

## Step 3: Start Backend Server

### Option A: Using Python directly

```bash
cd backend
python main.py
```

### Option B: Using uvicorn

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at: `http://localhost:8000`

## Step 4: Verify Connection

### 4.1 Check Backend Health

Open browser: `http://localhost:8000/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "database": "connected",
  "ai_service": "active"
}
```

### 4.2 Check API Documentation

Open browser: `http://localhost:8000/docs`

This shows the interactive API documentation.

## Step 5: Frontend Configuration

The frontend is already configured to connect to `http://localhost:8000`.

If you need to change the backend URL, create a `.env` file in the `frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## Troubleshooting

### Database Connection Error

1. **Check PostgreSQL is running:**
   ```bash
   # Windows
   services.msc (look for PostgreSQL service)
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Verify database exists:**
   ```bash
   psql -U postgres -l
   ```

3. **Check connection string in .env:**
   - Format: `postgresql://username:password@host:port/database`
   - Make sure password doesn't have special characters that need encoding

### Port Already in Use

If port 8000 is already in use:
```bash
# Find process using port 8000
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000

# Kill the process or change port in main.py
```

### Missing Dependencies

```bash
# Reinstall all dependencies
pip install -r requirements.txt --upgrade
```

## Testing the Connection

1. **Start backend:** `python main.py`
2. **Start frontend:** `npm run dev` (in frontend folder)
3. **Test search:** Use the job search form on homepage
4. **Test chatbot:** Click the chatbot button (bottom right)

## Next Steps

- The database tables will be created automatically on first startup
- Chat tables are created via `create_chat_tables()` in `main.py`
- Job data should be imported using the database setup scripts


