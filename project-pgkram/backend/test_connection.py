#!/usr/bin/env python3
"""
Quick test script to verify database and backend connection
"""

import asyncio
import asyncpg
from config import DATABASE_URL

async def test_database_connection():
    """Test PostgreSQL database connection"""
    print("Testing database connection...")
    print(f"Database URL: {DATABASE_URL.split('@')[0]}@***")  # Hide password
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("✅ Database connection successful!")
        
        # Test query
        result = await conn.fetchval("SELECT version()")
        print(f"✅ PostgreSQL version: {result.split(',')[0]}")
        
        # Check if database exists
        db_name = DATABASE_URL.split('/')[-1]
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", db_name
        )
        if exists:
            print(f"✅ Database '{db_name}' exists")
        else:
            print(f"⚠️  Database '{db_name}' does not exist")
        
        await conn.close()
        return True
        
    except asyncpg.InvalidPasswordError:
        print("❌ Database connection failed: Invalid password")
        return False
    except asyncpg.InvalidCatalogNameError:
        print(f"❌ Database connection failed: Database does not exist")
        print(f"   Please create the database: CREATE DATABASE {DATABASE_URL.split('/')[-1]};")
        return False
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

async def test_tables():
    """Test if required tables exist"""
    print("\nTesting database tables...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        tables = ['jobs', 'job_types', 'qualifications', 'experience_levels', 'districts']
        for table in tables:
            exists = await conn.fetchval(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)",
                table
            )
            if exists:
                count = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
                print(f"✅ Table '{table}' exists ({count} rows)")
            else:
                print(f"⚠️  Table '{table}' does not exist")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Table check failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("Punjab Job Portal - Connection Test")
    print("=" * 60)
    print()
    
    # Test database connection
    db_ok = await test_database_connection()
    
    if db_ok:
        # Test tables
        await test_tables()
    
    print()
    print("=" * 60)
    if db_ok:
        print("✅ All tests passed! Your database is ready.")
        print("\nNext steps:")
        print("1. Make sure your .env file is configured")
        print("2. Run: python main.py")
        print("3. Visit: http://localhost:8000/docs")
    else:
        print("❌ Connection test failed. Please check:")
        print("1. PostgreSQL is running")
        print("2. Database exists")
        print("3. .env file has correct DATABASE_URL")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())


