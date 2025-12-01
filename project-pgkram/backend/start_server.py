#!/usr/bin/env python3
"""
Startup script for the Punjab Job Portal Chatbot API
This script sets up the database and starts the FastAPI server
"""

import asyncio
import subprocess
import sys
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"Python version: {sys.version.split()[0]}")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("Installing dependencies...")
    try:
        script_dir = Path(__file__).parent
        req_path = script_dir / "requirements.txt"
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(req_path)], check=True)
        print("Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to install dependencies: {e}")
        return False

async def setup_database():
    """Setup database tables"""
    print("Setting up database...")
    try:
        from setup_database import setup_chat_tables
        await setup_chat_tables()
        return True
    except Exception as e:
        print(f"Database setup failed: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("Starting Punjab Job Portal Chatbot API...")
    print("API will be available at: http://localhost:8000")
    print("API documentation: http://localhost:8000/docs")
    print("WebSocket endpoint: ws://localhost:8000/ws/chat/{session_id}")
    print("\nTips:")
    print("   • Your React app should be running on http://localhost:5173")
    print("   • Make sure PostgreSQL is running with your database")
    print("   • Press Ctrl+C to stop the server")
    print("\n" + "="*60)
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Failed to start server: {e}")

async def main():
    """Main startup sequence"""
    print("Punjab Job Portal Chatbot API Startup")
    print("="*50)
    
    # Check Python version
    if not check_python_version():
        return
    
    # Install dependencies
    if not install_dependencies():
        return
    
    # Setup database
    if not await setup_database():
        return
    
    # Start server
    start_server()

if __name__ == "__main__":
    asyncio.run(main())


