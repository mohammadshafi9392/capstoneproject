#!/usr/bin/env python3
"""
Database setup script for the Punjab Job Portal Chatbot
This script creates the necessary chat tables in the PostgreSQL database
"""

import asyncio
import asyncpg
from config import DATABASE_URL

async def setup_chat_tables():
    """Create chat-related tables in the database"""
    print("Setting up chat tables for Punjab Job Portal Chatbot...")
    
    try:
        # Connect to database
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to PostgreSQL database")
        
        # Create chat_sessions table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id SERIAL PRIMARY KEY,
                session_id UUID DEFAULT gen_random_uuid() UNIQUE,
                user_ip VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("Created chat_sessions table")
        
        # Create chat_messages table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                session_id UUID,
                message_type VARCHAR(10) CHECK (message_type IN ('user', 'bot')),
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            )
        """)
        print("Created chat_messages table")
        
        # Create user_preferences table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                id SERIAL PRIMARY KEY,
                session_id UUID,
                job_type VARCHAR(50),
                preferred_districts INTEGER[],
                experience_level VARCHAR(50),
                qualification VARCHAR(100),
                salary_range JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("Created user_preferences table")
        
        # Create indexes for better performance
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
            ON chat_messages(session_id)
        """)
        print("Created index on chat_messages.session_id")
        
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp 
            ON chat_messages(timestamp)
        """)
        print("Created index on chat_messages.timestamp")
        
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id 
            ON chat_sessions(session_id)
        """)
        print("Created index on chat_sessions.session_id")
        
        # Verify existing tables
        existing_tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        print("\nAll tables in the database:")
        for table in existing_tables:
            print(f"   • {table['table_name']}")
        
        # Test the job_search_view
        job_count = await conn.fetchval("SELECT COUNT(*) FROM job_search_view")
        print(f"\nJob search view contains {job_count} jobs")
        
        await conn.close()
        print("\nDatabase setup completed successfully!")
        print("You can now start the chatbot API with: python main.py")
        
    except Exception as e:
        print(f"Error setting up database: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(setup_chat_tables())
