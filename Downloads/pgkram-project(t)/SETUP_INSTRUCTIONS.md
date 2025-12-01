# Punjab Job Portal - Complete Setup Instructions

## 📋 Prerequisites

### Required Software:
1. **PostgreSQL 17** - Database server
2. **Python 3.8+** - Backend runtime
3. **Node.js 16+** - Frontend runtime
4. **Git** - Version control (optional)

### Download Links:
- PostgreSQL: https://www.postgresql.org/download/windows/
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## 🗄️ Database Setup (PostgreSQL)

### Step 1: Install PostgreSQL 17
1. Download PostgreSQL 17 from the official website
2. Run the installer with default settings
3. Remember the password you set for the `postgres` user
4. Complete the installation

### Step 2: Verify PostgreSQL Installation
Open Command Prompt or PowerShell and run:
```bash
psql --version
```

### Step 3: Setup Database
Navigate to your project directory and run:

**Option A: Using the batch file (Recommended)**
```bash
# Navigate to database folder
cd database

# Run the setup batch file
run_database_setup_postgres.bat
```

**Option B: Manual setup**
```bash
# Navigate to database folder
cd database

# Run the SQL setup script
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres -f database_setup_postgres.sql
```

### Step 4: Verify Database Setup
```bash
# Connect to the database
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d punjab_job_portal

# Run these commands in psql:
\l                    # List databases
\dt                   # List tables
SELECT COUNT(*) FROM jobs;  # Should show 100+ jobs
\q                    # Quit psql
```

---

## 🐍 Backend Setup (Python/FastAPI)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Database Connection
Create a `.env` file in the backend directory:
```bash
# Create .env file
echo DATABASE_URL=postgresql://postgres:tiger@localhost:5432/punjab_job_portal > .env
```
**Replace `YOUR_PASSWORD` with your PostgreSQL password**

### Step 4: Add September 2025 Job Data
```bash
python add_month_data.py
```

### Step 5: Start Backend Server
```bash
    python -m uvicorn main:app --host 127.0.0.1 --port 8000        
```

**Backend will be running at: http://127.0.0.1:8000**       

---

## ⚛️ Frontend Setup (React/Vite)

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

### Step 3: Configure Backend URL for the Frontend
Create a `.env` file (or update an existing one) so every API module hits the FastAPI server:
```bash
echo VITE_BACKEND_URL=http://127.0.0.1:8000 > .env
```

### Step 4: Start Frontend Development Server
```bash
 npm run dev
```


**Frontend will be running at: http://localhost:5173**

---

## 🚀 Running the Complete Application

### Terminal 1: Backend Server
```bash
# Navigate to backend
cd backend

# Start backend server
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Terminal 2: Frontend Server
```bash
# Navigate to frontend
cd frontend

# Start frontend server
npm run dev
```

### Access the Application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

---

## 📊 Database Features

### What's Included:
- **25 Punjab Districts** with taluks
- **100+ Job Listings** across various sectors
- **Government & Private Jobs**
- **Multiple Qualification Levels**
- **Experience Ranges**
- **Salary Information**
- **September 2025 Data** for trend analysis

### Sample Data Includes:
- Punjab Civil Services Officer
- Software Developer positions
- Teaching positions
- Healthcare jobs
- Engineering roles
- Administrative positions

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sc query postgresql

# Start PostgreSQL service
net start postgresql
```

#### 2. Python Dependencies Issues
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies again
pip install -r requirements.txt
```

#### 3. Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 4. Port Already in Use
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

---

## 📁 Project Structure

```
project-pgkram/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main application file
│   ├── models.py           # Database models
│   ├── database.py         # Database connection
│   ├── requirements.txt    # Python dependencies
│   └── routers/           # API routes
├── frontend/               # React frontend
│   ├── src/               # Source code
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
├── database/               # Database setup files
│   ├── database_setup_postgres.sql
│   └── run_database_setup_postgres.bat
└── SETUP_INSTRUCTIONS.md  # This file
```

---

## 🎯 Quick Start Commands

### Complete Setup (Copy & Paste):
```bash
# 1. Setup Database
cd database
run_database_setup_postgres.bat

# 2. Setup Backend
cd ../backend
pip install -r requirements.txt
python add_september_data.py
python -m uvicorn main:app --host 127.0.0.1 --port 8000

# 3. Setup Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure PostgreSQL service is running
4. Check that ports 8000 and 5173 are available

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ PostgreSQL database `punjab_job_portal` exists with 100+ jobs
- ✅ Backend API responds at http://127.0.0.1:8000
- ✅ Frontend loads at http://localhost:5173
- ✅ You can see job listings in the web interface
- ✅ API documentation is accessible at http://127.0.0.1:8000/docs

**Happy coding! 🚀**
