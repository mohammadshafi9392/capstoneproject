import asyncio
import asyncpg
import json
from typing import List, Dict, Any, Optional, Tuple
from config import DATABASE_URL


class DatabaseManager:
    def __init__(self):
        self.pool = None
        self.users_table_ready = False

    async def create_pool(self):
        """Create database connection pool"""
        self.pool = await asyncpg.create_pool(DATABASE_URL)
        print("✅ Database connection pool created")

    async def close_pool(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            print("🛑 Database connection pool closed")

    async def execute_query(self, query: str, *args) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *args)
            return [dict(row) for row in rows]

    async def execute_insert(self, query: str, *args) -> str:
        """Execute an INSERT query and return the inserted ID"""
        async with self.pool.acquire() as conn:
            return await conn.fetchval(query, *args)

    async def fetch_one(self, query: str, *args):
        """Fetch a single row from the database"""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None

    async def create_chat_tables(self):
        """Create chat-related tables if they don't exist"""
        async with self.pool.acquire() as conn:
            # chat_sessions table
            await conn.execute("""
                CREATE EXTENSION IF NOT EXISTS "pgcrypto";

                CREATE TABLE IF NOT EXISTS chat_sessions (
                    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_ip VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # chat_messages table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id SERIAL PRIMARY KEY,
                    session_id UUID REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
                    message_type VARCHAR(10) CHECK (message_type IN ('user', 'bot')),
                    content TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    metadata JSONB
                );
            """)

            # user_preferences table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS user_preferences (
                    id SERIAL PRIMARY KEY,
                    session_id UUID REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
                    job_type VARCHAR(50),
                    preferred_districts INTEGER[],
                    experience_level VARCHAR(50),
                    qualification VARCHAR(100),
                    salary_range JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            print("✅ Chat tables created successfully")

    async def create_user_table(self):
        """Create users table for authentication"""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    full_name VARCHAR(150) NOT NULL,
                    email VARCHAR(150) NOT NULL UNIQUE,
                    phone VARCHAR(20),
                    hashed_password VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            print("✅ Users table verified")
            self.users_table_ready = True

    async def create_job_support_tables(self):
        """Create auxiliary tables for job workflows."""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS job_applications (
                    id SERIAL PRIMARY KEY,
                    job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
                    applicant_name VARCHAR(150) NOT NULL,
                    email VARCHAR(150) NOT NULL,
                    phone VARCHAR(50),
                    resume_url TEXT,
                    cover_letter TEXT,
                    status VARCHAR(30) DEFAULT 'submitted',
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            await conn.execute("""
                CREATE OR REPLACE VIEW job_search_view AS
                SELECT
                    j.id,
                    j.job_title,
                    j.job_description,
                    j.organization_name,
                    jt.type_name AS job_type,
                    q.qualification_name AS qualification,
                    el.level_name AS experience_level,
                    d.district_name,
                    t.taluk_name,
                    j.salary_min,
                    j.salary_max,
                    j.application_deadline,
                    j.job_posted_date,
                    j.total_vacancies,
                    j.requirements,
                    j.benefits,
                    j.contact_details
                FROM jobs j
                JOIN job_types jt ON j.job_type_id = jt.id
                JOIN qualifications q ON j.qualification_id = q.id
                JOIN experience_levels el ON j.experience_level_id = el.id
                JOIN districts d ON j.district_id = d.id
                LEFT JOIN taluks t ON j.taluk_id = t.id
                WHERE j.is_active = TRUE;
            """)
            print("✅ Job support tables verified")

    def _build_job_filter_clause(
        self,
        search: Optional[str] = None,
        job_type: Optional[str] = None,
        qualification: Optional[str] = None,
        district: Optional[str] = None,
        experience: Optional[str] = None,
        min_salary: Optional[float] = None,
        max_salary: Optional[float] = None,
        taluk: Optional[str] = None,
        organization: Optional[str] = None,
    ) -> Tuple[str, List[Any]]:
        """Constructs dynamic filter clause shared by list APIs."""
        clauses: List[str] = []
        params: List[Any] = []

        def add_clause(template: str, value: Any):
            params.append(value)
            placeholder = f"${len(params)}"
            clauses.append(template.format(n=placeholder))

        if search:
            like_value = f"%{search}%"
            add_clause(
                "(job_title ILIKE {n} OR organization_name ILIKE {n} OR job_description ILIKE {n})",
                like_value
            )

        if job_type:
            add_clause("job_type ILIKE {n}", job_type)

        if qualification:
            add_clause("qualification ILIKE {n}", qualification)

        if district:
            add_clause("district_name ILIKE {n}", f"%{district}%")

        if taluk:
            add_clause("taluk_name ILIKE {n}", f"%{taluk}%")

        if experience:
            add_clause("experience_level ILIKE {n}", experience)

        if organization:
            add_clause("organization_name ILIKE {n}", f"%{organization}%")

        if min_salary is not None:
            add_clause("salary_max >= {n}", min_salary)

        if max_salary is not None:
            add_clause("salary_min <= {n}", max_salary)

        clause_sql = f" WHERE {' AND '.join(clauses)}" if clauses else ""
        return clause_sql, params

    async def list_jobs(
        self,
        *,
        search: Optional[str] = None,
        job_type: Optional[str] = None,
        qualification: Optional[str] = None,
        district: Optional[str] = None,
        experience: Optional[str] = None,
        min_salary: Optional[float] = None,
        max_salary: Optional[float] = None,
        taluk: Optional[str] = None,
        organization: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
        sort: str = "recent"
    ) -> Tuple[List[Dict[str, Any]], int]:
        """List jobs for the frontend with pagination and filters."""
        limit = max(1, min(limit, 50))
        page = max(1, page)
        offset = (page - 1) * limit

        filter_clause, filter_params = self._build_job_filter_clause(
            search=search,
            job_type=job_type,
            qualification=qualification,
            district=district,
            experience=experience,
            min_salary=min_salary,
            max_salary=max_salary,
            taluk=taluk,
            organization=organization,
        )

        sort_map = {
            "recent": "ORDER BY job_posted_date DESC NULLS LAST",
            "deadline": "ORDER BY application_deadline ASC NULLS LAST",
            "salary_high": "ORDER BY salary_max DESC NULLS LAST",
            "salary_low": "ORDER BY salary_min ASC NULLS LAST",
        }
        order_clause = sort_map.get(sort, sort_map["recent"])

        data_query = f"""
            SELECT 
                id,
                job_title,
                job_description,
                organization_name,
                job_type,
                qualification,
                experience_level,
                district_name,
                taluk_name,
                salary_min,
                salary_max,
                application_deadline,
                job_posted_date,
                total_vacancies,
                requirements,
                benefits,
                contact_details
            FROM job_search_view
            {filter_clause}
            {order_clause}
            LIMIT ${len(filter_params) + 1}
            OFFSET ${len(filter_params) + 2};
        """
        rows = await self.execute_query(
            data_query,
            *(filter_params + [limit, offset])
        )

        count_query = f"SELECT COUNT(*) FROM job_search_view {filter_clause};"
        total_result = await self.fetch_one(count_query, *filter_params)
        total = int(total_result["count"]) if total_result else 0

        return rows, total

    async def get_job_detail(self, job_id: int) -> Optional[Dict[str, Any]]:
        """Fetch a single job record with descriptive fields."""
        query = """
            SELECT 
                id,
                job_title,
                job_description,
                organization_name,
                job_type,
                qualification,
                experience_level,
                district_name,
                taluk_name,
                salary_min,
                salary_max,
                application_deadline,
                job_posted_date,
                total_vacancies,
                requirements,
                benefits,
                contact_details
            FROM job_search_view
            WHERE id = $1;
        """
        return await self.fetch_one(query, job_id)

    async def create_job(self, payload: Dict[str, Any]) -> int:
        """Insert a new job posting."""
        query = """
            INSERT INTO jobs (
                job_title,
                job_description,
                organization_name,
                employer_id,
                job_type_id,
                qualification_id,
                experience_level_id,
                district_id,
                taluk_id,
                salary_min,
                salary_max,
                salary_currency,
                application_deadline,
                total_vacancies,
                requirements,
                benefits,
                contact_details,
                is_active
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13, $14, $15, $16, $17, $18
            )
            RETURNING id;
        """
        return await self.execute_insert(
            query,
            payload.get("job_title"),
            payload.get("job_description"),
            payload.get("organization_name"),
            payload.get("employer_id"),
            payload.get("job_type_id"),
            payload.get("qualification_id"),
            payload.get("experience_level_id"),
            payload.get("district_id"),
            payload.get("taluk_id"),
            payload.get("salary_min"),
            payload.get("salary_max"),
            payload.get("salary_currency", "INR"),
            payload.get("application_deadline"),
            payload.get("total_vacancies", 1),
            payload.get("requirements"),
            payload.get("benefits"),
            payload.get("contact_details"),
            payload.get("is_active", True),
        )

    async def update_job(self, job_id: int, payload: Dict[str, Any]) -> Optional[int]:
        """Update mutable job fields."""
        if not payload:
            return job_id

        set_clauses = []
        params = []
        for column, value in payload.items():
            params.append(value)
            set_clauses.append(f"{column} = ${len(params)}")

        params.append(job_id)
        query = f"""
            UPDATE jobs
            SET {', '.join(set_clauses)}
            WHERE id = ${len(params)}
            RETURNING id;
        """
        return await self.execute_insert(query, *params)

    async def deactivate_job(self, job_id: int) -> Optional[int]:
        """Soft delete a job by marking it inactive."""
        query = """
            UPDATE jobs
            SET is_active = FALSE
            WHERE id = $1
            RETURNING id;
        """
        return await self.execute_insert(query, job_id)

    async def apply_for_job(
        self,
        job_id: int,
        applicant_name: str,
        email: str,
        phone: Optional[str] = None,
        resume_url: Optional[str] = None,
        cover_letter: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> int:
        """Create a job application for a job if it exists and is active."""
        job_exists = await self.fetch_one(
            "SELECT id FROM jobs WHERE id = $1 AND is_active = TRUE",
            job_id
        )
        if not job_exists:
            raise ValueError("Job not found or inactive")

        query = """
            INSERT INTO job_applications (
                job_id,
                applicant_name,
                email,
                phone,
                resume_url,
                cover_letter,
                metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        """
        return await self.execute_insert(
            query,
            job_id,
            applicant_name,
            email,
            phone,
            resume_url,
            cover_letter,
            json.dumps(metadata or {})
        )

    async def get_applications(
        self,
        email: Optional[str] = None,
        phone: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Fetch applications for a given applicant identifier."""
        if not email and not phone:
            raise ValueError("Email or phone is required to fetch applications")

        query = """
            SELECT
                a.id,
                a.job_id,
                a.applicant_name,
                a.email,
                a.phone,
                a.resume_url,
                a.cover_letter,
                a.status,
                a.created_at,
                j.job_title,
                j.organization_name,
                jt.type_name AS job_type,
                j.application_deadline
            FROM job_applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN job_types jt ON j.job_type_id = jt.id
            WHERE 1=1
        """
        params = []
        if email:
            params.append(email)
            query += f" AND a.email = ${len(params)}"
        if phone:
            params.append(phone)
            query += f" AND a.phone = ${len(params)}"

        query += " ORDER BY a.created_at DESC;"
        return await self.execute_query(query, *params)

    async def get_job_filter_options(self) -> Dict[str, List[Dict[str, Any]]]:
        """Return dropdown options for the frontend."""
        job_types = await self.execute_query(
            "SELECT id, type_name FROM job_types ORDER BY type_name;"
        )
        qualifications = await self.execute_query(
            "SELECT id, qualification_name FROM qualifications ORDER BY qualification_name;"
        )
        experience_levels = await self.execute_query(
            "SELECT id, level_name FROM experience_levels ORDER BY min_years;"
        )
        districts = await self.execute_query(
            "SELECT id, district_name FROM districts ORDER BY district_name;"
        )

        return {
            "job_types": job_types,
            "qualifications": qualifications,
            "experience_levels": experience_levels,
            "districts": districts
        }

    async def search_jobs(self, job_type: str = None, qualification: str = None,
                          district: str = None, experience: str = None,
                          keywords: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Search jobs based on filters"""
        query = """
            SELECT 
                j.id,
                j.job_title,
                j.organization_name,
                jt.type_name AS job_type,
                q.qualification_name AS qualification,
                el.level_name AS experience_level,
                d.district_name,
                t.taluk_name,
                j.salary_min,
                j.salary_max,
                j.application_deadline,
                j.job_posted_date,
                j.total_vacancies,
                j.requirements,
                j.benefits
            FROM jobs j
            JOIN job_types jt ON j.job_type_id = jt.id
            JOIN qualifications q ON j.qualification_id = q.id
            JOIN experience_levels el ON j.experience_level_id = el.id
            JOIN districts d ON j.district_id = d.id
            LEFT JOIN taluks t ON j.taluk_id = t.id
            WHERE j.is_active = TRUE
        """

        conditions = []
        params = []
        param_count = 1

        if job_type:
            conditions.append(f"jt.type_name = ${param_count}")
            params.append(job_type)
            param_count += 1

        if qualification:
            conditions.append(f"q.qualification_name = ${param_count}")
            params.append(qualification)
            param_count += 1

        if district:
            conditions.append(f"d.district_name ILIKE ${param_count}")
            params.append(f"%{district}%")
            param_count += 1

        if experience:
            conditions.append(f"el.level_name = ${param_count}")
            params.append(experience)
            param_count += 1

        if keywords:
            conditions.append(f"(j.job_title ILIKE ${param_count} OR j.requirements ILIKE ${param_count} OR j.benefits ILIKE ${param_count})")
            params.append(f"%{keywords}%")
            param_count += 1

        if conditions:
            query += " AND " + " AND ".join(conditions)

        query += f" ORDER BY j.salary_max DESC LIMIT ${param_count}"
        params.append(limit)

        return await self.execute_query(query, *params)

    async def get_job_statistics(self) -> Dict[str, Any]:
        """Get job statistics for chatbot"""
        stats_query = """
            SELECT 
                (SELECT COUNT(*) FROM job_search_view WHERE job_type = 'Government') AS gov_jobs,
                (SELECT COUNT(*) FROM job_search_view WHERE job_type = 'Private') AS private_jobs,
                (SELECT COUNT(*) FROM districts) AS total_districts,
                (SELECT COUNT(*) FROM employers) AS total_employers;
        """
        result = await self.execute_query(stats_query)
        return result[0] if result else {}

    async def get_jobs_trend_by_month(self, months: int = 2) -> List[Dict[str, Any]]:
        """Jobs posted per month for the last N months"""
        query = """
            SELECT TO_CHAR(DATE_TRUNC('month', j.job_posted_date), 'YYYY-MM') AS month,
                   COUNT(*) AS jobs
            FROM jobs j
            WHERE j.job_posted_date >= (CURRENT_DATE - INTERVAL '2 months')
            GROUP BY 1
            ORDER BY 1 ASC;
        """
        return await self.execute_query(query)

    async def get_top_districts(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Districts with most active jobs"""
        query = """
            SELECT d.district_name AS district, COUNT(*) AS jobs
            FROM jobs j
            JOIN districts d ON j.district_id = d.id
            WHERE j.is_active = TRUE
            GROUP BY d.district_name
            ORDER BY jobs DESC
            LIMIT $1;
        """
        return await self.execute_query(query, limit)

    async def get_salary_distribution(self) -> List[Dict[str, Any]]:
        """Salary distribution buckets"""
        query = """
            SELECT bucket, COUNT(*) AS jobs
            FROM (
                SELECT CASE
                    WHEN j.salary_max < 15000 THEN '<15k'
                    WHEN j.salary_max BETWEEN 15000 AND 30000 THEN '15k-30k'
                    WHEN j.salary_max BETWEEN 30001 AND 60000 THEN '30k-60k'
                    WHEN j.salary_max BETWEEN 60001 AND 100000 THEN '60k-100k'
                    ELSE '100k+'
                END AS bucket
                FROM jobs j
                WHERE j.is_active = TRUE
            ) s
            GROUP BY bucket
            ORDER BY CASE bucket
                WHEN '<15k' THEN 1
                WHEN '15k-30k' THEN 2
                WHEN '30k-60k' THEN 3
                WHEN '60k-100k' THEN 4
                ELSE 5
            END;
        """
        return await self.execute_query(query)

    async def get_top_organizations(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Organizations with most job postings"""
        query = """
            SELECT j.organization_name AS organization, COUNT(*) AS jobs
            FROM jobs j
            WHERE j.is_active = TRUE
            GROUP BY j.organization_name
            ORDER BY jobs DESC
            LIMIT $1;
        """
        return await self.execute_query(query, limit)

    async def save_chat_message(self, session_id: Optional[str], message_type: str,
                                content: str, metadata: Dict = None) -> int:
        """Save a chat message (auto-create session if missing)"""
        async with self.pool.acquire() as conn:
            # Create session if not provided or invalid
            if not session_id:
                session_id = await conn.fetchval("""
                    INSERT INTO chat_sessions (user_ip)
                    VALUES ($1)
                    RETURNING session_id;
                """, metadata.get("user_ip") if metadata else None)
            else:
                exists = await conn.fetchval("""
                    SELECT EXISTS(SELECT 1 FROM chat_sessions WHERE session_id = $1);
                """, session_id)
                if not exists:
                    session_id = await conn.fetchval("""
                        INSERT INTO chat_sessions (user_ip)
                        VALUES ($1)
                        RETURNING session_id;
                    """, metadata.get("user_ip") if metadata else None)

            # Insert chat message
            message_id = await conn.fetchval("""
                INSERT INTO chat_messages (session_id, message_type, content, metadata)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            """, session_id, message_type, content, json.dumps(metadata or {}))

            print(f"💬 Message saved (session_id={session_id}, id={message_id})")
            return message_id

    async def get_chat_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve recent chat messages"""
        query = """
            SELECT message_type, content, timestamp, metadata
            FROM chat_messages
            WHERE session_id = $1
            ORDER BY timestamp DESC
            LIMIT $2;
        """
        return await self.execute_query(query, session_id, limit)

    async def create_or_get_session(self, user_ip: str = None) -> str:
        """Create a new session or return existing one"""
        query = """
            INSERT INTO chat_sessions (user_ip)
            VALUES ($1)
            RETURNING session_id;
        """
        return await self.execute_insert(query, user_ip)

    async def get_user_by_email(self, email: str):
        """Fetch user by email (stored lower-case)"""
        query = """
            SELECT id, full_name, email, phone, hashed_password, role, created_at
            FROM users
            WHERE email = $1
        """
        return await self.fetch_one(query, email)

    async def get_user_by_id(self, user_id: int):
        """Fetch user by ID"""
        query = """
            SELECT id, full_name, email, phone, role, created_at
            FROM users
            WHERE id = $1
        """
        return await self.fetch_one(query, user_id)

    async def create_user(self, full_name: str, email: str, phone: str,
                          hashed_password: str, role: str = "user"):
        """Create a new user account"""
        query = """
            INSERT INTO users (full_name, email, phone, hashed_password, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        """
        user_id = await self.execute_insert(query, full_name, email, phone, hashed_password, role)
        return await self.get_user_by_id(int(user_id))


# Global instance
db_manager = DatabaseManager()
