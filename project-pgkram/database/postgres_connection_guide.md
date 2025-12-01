# PostgreSQL 17 Database Setup Guide

## Prerequisites
- PostgreSQL 17 installed and running
- psql command-line tool accessible
- Default user: `postgres`

## Quick Setup

### Option 1: Run Batch File (Windows)
1. Double-click `run_database_setup_postgres.bat`
2. Enter your PostgreSQL password when prompted
3. Wait for setup to complete

### Option 2: Manual Command Line
```bash
# Create and setup database
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -f database_setup_postgres.sql

# Run sample queries
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d punjab_job_portal -f sample_queries_postgres.sql
```

### Option 3: PowerShell Commands
```powershell
# Setup database
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -f database_setup_postgres.sql

# Test queries
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d punjab_job_portal -f sample_queries_postgres.sql
```

## Key PostgreSQL Differences from MySQL

### 1. Data Types
- `INT` → `INTEGER` or `SERIAL`
- `AUTO_INCREMENT` → `SERIAL`
- `TIMESTAMP` → `TIMESTAMP` (same but different syntax)
- `ENUM` → `CHECK` constraints

### 2. Syntax Differences
- `\c database_name` - Connect to database
- `\\` - Execute SQL file
- `CURRENT_TIMESTAMP` instead of `NOW()`
- `INTERVAL '30 days'` instead of `INTERVAL 30 DAY`

### 3. PostgreSQL-Specific Features
- UUID extension support
- Advanced indexing (GIN, GiST)
- Full-text search capabilities
- JSON/JSONB data types
- Array support
- Window functions

## Database Structure

### Tables Created:
1. **districts** - Punjab districts
2. **taluks** - Sub-district areas
3. **job_types** - Government/Private
4. **qualifications** - Education levels
5. **experience_levels** - Experience ranges
6. **employers** - Organizations
7. **jobs** - Job listings (100+ records)
8. **job_seekers** - User profiles

### Features:
- ✅ Foreign key constraints
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps
- ✅ Views for complex queries
- ✅ Sample data for all Punjab districts

## Connection Details

### Database: `punjab_job_portal`
### Default Connection:
- Host: `localhost`
- Port: `5432`
- Database: `punjab_job_portal`
- User: `postgres`

## Testing Your Setup

1. **Check database exists:**
   ```sql
   \l
   ```

2. **Connect to database:**
   ```sql
   \c punjab_job_portal
   ```

3. **View tables:**
   ```sql
   \dt
   ```

4. **Count records:**
   ```sql
   SELECT COUNT(*) FROM jobs;
   ```

## Sample Queries to Test

```sql
-- Basic job search
SELECT job_title, organization_name, district_name 
FROM job_search_view 
WHERE job_type = 'Government' 
LIMIT 5;

-- Statistics
SELECT job_type, COUNT(*) 
FROM job_search_view 
GROUP BY job_type;
```

## Troubleshooting

### Common Issues:
1. **Password prompt:** Enter your PostgreSQL postgres user password
2. **Permission denied:** Ensure postgres user has CREATE DATABASE privileges
3. **Connection refused:** Check if PostgreSQL service is running
4. **'psql' is not recognized:** Use full path `"C:\Program Files\PostgreSQL\17\bin\psql.exe"` or add to PATH

### Check PostgreSQL Status:
```bash
# Windows
sc query postgresql

# Or check services
services.msc
```

## Next Steps

1. Run the setup script
2. Test with sample queries
3. Connect your React app using:
   - `pg` (Node.js PostgreSQL client)
   - Connection string: `postgresql://postgres:password@localhost:5432/punjab_job_portal`
