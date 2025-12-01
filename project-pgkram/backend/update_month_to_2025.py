#!/usr/bin/env python3
"""
Update September data from 2024 to 2025 to make it the previous month
"""

import asyncio
import asyncpg
from datetime import datetime
from config import DATABASE_URL

async def update_september_to_2025():
    """Update September jobs from 2024 to 2025"""
    print("Updating September jobs from 2024 to 2025...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to PostgreSQL database")
        
        # Update all September 2024 jobs to September 2025
        result = await conn.execute("""
            UPDATE jobs 
            SET job_posted_date = job_posted_date + INTERVAL '1 year'
            WHERE job_posted_date >= '2024-09-01' 
            AND job_posted_date < '2024-10-01'
        """)
        
        print(f"Updated {result.split()[-1]} jobs from September 2024 to September 2025")
        
        # Verify the update
        dates = await conn.fetch("""
            SELECT job_posted_date, COUNT(*) as count 
            FROM jobs 
            GROUP BY job_posted_date 
            ORDER BY job_posted_date
        """)
        print('\nUpdated job dates:')
        for row in dates:
            print(f'  {row["job_posted_date"]}: {row["count"]} jobs')
        
        # Check trend data
        trend = await conn.fetch("""
            SELECT to_char(date_trunc('month', j.job_posted_date), 'YYYY-MM') AS month,
                   COUNT(*) AS jobs
            FROM jobs j
            WHERE j.job_posted_date >= '2025-09-01'
            GROUP BY 1
            ORDER BY 1 ASC
        """)
        print('\nTrend data (September and October 2025):')
        for row in trend:
            print(f'  {row["month"]}: {row["jobs"]} jobs')
        
        await conn.close()
        print("\nSeptember data updated to 2025 successfully!")
        
    except Exception as e:
        print(f"Error updating September data: {e}")

if __name__ == "__main__":
    asyncio.run(update_september_to_2025())
