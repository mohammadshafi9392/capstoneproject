#!/usr/bin/env python3
"""
Check trend data to see what months are being returned
"""

import asyncio
import asyncpg
from config import DATABASE_URL

async def check_trend_data():
    """Check what trend data is being returned"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Check all job dates
        dates = await conn.fetch("""
            SELECT job_posted_date, COUNT(*) as count 
            FROM jobs 
            GROUP BY job_posted_date 
            ORDER BY job_posted_date
        """)
        print('Job dates in database:')
        for row in dates:
            print(f'  {row["job_posted_date"]}: {row["count"]} jobs')
        
        # Check trend data (from September 2024)
        trend = await conn.fetch("""
            SELECT to_char(date_trunc('month', j.job_posted_date), 'YYYY-MM') AS month,
                   COUNT(*) AS jobs
            FROM jobs j
            WHERE j.job_posted_date >= '2024-09-01'
            GROUP BY 1
            ORDER BY 1 ASC
        """)
        print('\nTrend data (last 6 months from today):')
        for row in trend:
            print(f'  {row["month"]}: {row["jobs"]} jobs')
        
        # Check all months in database
        all_months = await conn.fetch("""
            SELECT to_char(date_trunc('month', j.job_posted_date), 'YYYY-MM') AS month,
                   COUNT(*) AS jobs
            FROM jobs j
            GROUP BY 1
            ORDER BY 1 ASC
        """)
        print('\nAll months in database:')
        for row in all_months:
            print(f'  {row["month"]}: {row["jobs"]} jobs')
        
        await conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_trend_data())
