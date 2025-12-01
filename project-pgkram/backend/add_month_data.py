#!/usr/bin/env python3
"""
Add September 2024 job data to see month-on-month trends
This script adds sample job data for September to demonstrate the trend analysis
"""

import asyncio
import asyncpg
from datetime import datetime, date
from config import DATABASE_URL

async def add_september_data():
    """Add September 2024 job data for trend analysis"""
    print("Adding September 2024 job data for trend analysis...")
    
    try:
        # Connect to database
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to PostgreSQL database")
        
        # Get existing IDs for foreign keys
        districts = await conn.fetch("SELECT id, district_name FROM districts")
        job_types = await conn.fetch("SELECT id, type_name FROM job_types")
        qualifications = await conn.fetch("SELECT id, qualification_name FROM qualifications")
        experience_levels = await conn.fetch("SELECT id, level_name FROM experience_levels")
        
        # Create lookup dictionaries
        district_map = {d['district_name']: d['id'] for d in districts}
        job_type_map = {jt['type_name']: jt['id'] for jt in job_types}
        qualification_map = {q['qualification_name']: q['id'] for q in qualifications}
        experience_map = {el['level_name']: el['id'] for el in experience_levels}
        
        # September 2024 job data (sample data to show trend)
        september_jobs = [
            {
                'job_title': 'Software Engineer',
                'organization_name': 'Tech Solutions Pvt Ltd',
                'job_type': 'Private',
                'qualification': 'Graduate',
                'experience': '2-5 years',
                'district': 'Ludhiana',
                'salary_min': 35000,
                'salary_max': 55000,
                'total_vacancies': 5,
                'job_posted_date': datetime(2024, 9, 1, 10, 0, 0)
            },
            {
                'job_title': 'Data Analyst',
                'organization_name': 'Analytics Corp',
                'job_type': 'Private',
                'qualification': 'Post Graduate',
                'experience': '0-2 years',
                'district': 'Chandigarh',
                'salary_min': 25000,
                'salary_max': 40000,
                'total_vacancies': 3,
                'job_posted_date': datetime(2024, 9, 5, 14, 30, 0)
            },
            {
                'job_title': 'Marketing Manager',
                'organization_name': 'Digital Marketing Agency',
                'job_type': 'Private',
                'qualification': 'Graduate',
                'experience': '5-10 years',
                'district': 'Amritsar',
                'salary_min': 45000,
                'salary_max': 70000,
                'total_vacancies': 2,
                'job_posted_date': datetime(2024, 9, 10, 9, 15, 0)
            },
            {
                'job_title': 'Teacher',
                'organization_name': 'Punjab Education Department',
                'job_type': 'Government',
                'qualification': 'Post Graduate',
                'experience': '0-2 years',
                'district': 'Jalandhar',
                'salary_min': 30000,
                'salary_max': 45000,
                'total_vacancies': 10,
                'job_posted_date': datetime(2024, 9, 15, 11, 0, 0)
            },
            {
                'job_title': 'Nurse',
                'organization_name': 'Punjab Health Department',
                'job_type': 'Government',
                'qualification': 'Graduate',
                'experience': '2-5 years',
                'district': 'Patiala',
                'salary_min': 28000,
                'salary_max': 40000,
                'total_vacancies': 8,
                'job_posted_date': datetime(2024, 9, 20, 16, 45, 0)
            },
            {
                'job_title': 'Sales Executive',
                'organization_name': 'Retail Solutions Ltd',
                'job_type': 'Private',
                'qualification': '12th Pass',
                'experience': '0-2 years',
                'district': 'Bathinda',
                'salary_min': 15000,
                'salary_max': 25000,
                'total_vacancies': 6,
                'job_posted_date': datetime(2024, 9, 25, 13, 20, 0)
            },
            {
                'job_title': 'Accountant',
                'organization_name': 'Finance Solutions',
                'job_type': 'Private',
                'qualification': 'Graduate',
                'experience': '2-5 years',
                'district': 'Mohali',
                'salary_min': 22000,
                'salary_max': 35000,
                'total_vacancies': 4,
                'job_posted_date': datetime(2024, 9, 28, 15, 30, 0)
            },
            {
                'job_title': 'Police Constable',
                'organization_name': 'Punjab Police',
                'job_type': 'Government',
                'qualification': '12th Pass',
                'experience': '0-2 years',
                'district': 'Firozpur',
                'salary_min': 20000,
                'salary_max': 30000,
                'total_vacancies': 15,
                'job_posted_date': datetime(2024, 9, 30, 12, 0, 0)
            }
        ]
        
        # Insert September jobs
        inserted_count = 0
        for job in september_jobs:
            try:
                # Get foreign key IDs
                district_id = district_map.get(job['district'])
                job_type_id = job_type_map.get(job['job_type'])
                qualification_id = qualification_map.get(job['qualification'])
                experience_id = experience_map.get(job['experience'])
                
                if not all([district_id, job_type_id, qualification_id, experience_id]):
                    print(f"Skipping job {job['job_title']} - missing foreign key data")
                    continue
                
                # Insert job
                await conn.execute("""
                    INSERT INTO jobs (
                        job_title, organization_name, job_type_id, qualification_id, 
                        experience_level_id, district_id, salary_min, salary_max, 
                        total_vacancies, job_posted_date, is_active
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                """, 
                job['job_title'], job['organization_name'], job_type_id, qualification_id,
                experience_id, district_id, job['salary_min'], job['salary_max'],
                job['total_vacancies'], job['job_posted_date'], True)
                
                inserted_count += 1
                print(f"Added: {job['job_title']} at {job['organization_name']}")
                
            except Exception as e:
                print(f"Error inserting job {job['job_title']}: {e}")
        
        print(f"\nSuccessfully added {inserted_count} September 2024 jobs")
        
        # Verify the data by checking job counts by month
        monthly_counts = await conn.fetch("""
            SELECT 
                EXTRACT(YEAR FROM job_posted_date) as year,
                EXTRACT(MONTH FROM job_posted_date) as month,
                COUNT(*) as job_count
            FROM jobs 
            WHERE job_posted_date >= '2024-01-01'
            GROUP BY EXTRACT(YEAR FROM job_posted_date), EXTRACT(MONTH FROM job_posted_date)
            ORDER BY year, month
        """)
        
        print("\nMonthly job counts:")
        for row in monthly_counts:
            month_names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            print(f"  {int(row['year'])} {month_names[int(row['month'])]}: {row['job_count']} jobs")
        
        await conn.close()
        print("\nSeptember data addition completed successfully!")
        
    except Exception as e:
        print(f"Error adding September data: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(add_september_data())
