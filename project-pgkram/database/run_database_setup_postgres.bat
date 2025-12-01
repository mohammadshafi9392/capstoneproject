@echo off
echo Setting up Punjab Job Portal PostgreSQL Database...
echo.
echo Please enter your PostgreSQL password when prompted:
echo.
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres -f database_setup_postgres.sql
echo.
echo Database setup completed!
echo.
echo To run sample queries, use:
echo "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d punjab_job_portal -f sample_queries_postgres.sql
echo.
pause
