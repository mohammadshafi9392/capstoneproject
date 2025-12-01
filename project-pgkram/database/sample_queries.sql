-- Sample queries for testing the Punjab Job Portal database
USE punjab_job_portal;

-- 1. View all jobs with details
SELECT * FROM job_search_view LIMIT 10;

-- 2. Search jobs by type (Government)
SELECT job_title, organization_name, district_name, salary_min, salary_max, application_deadline
FROM job_search_view 
WHERE job_type = 'Government' 
ORDER BY job_posted_date DESC;

-- 3. Search jobs by qualification (Graduate)
SELECT job_title, organization_name, district_name, qualification, experience_level, salary_min, salary_max
FROM job_search_view 
WHERE qualification = 'Graduate' 
ORDER BY salary_max DESC;

-- 4. Search jobs by experience level (0-2 years)
SELECT job_title, organization_name, district_name, job_type, qualification, salary_min, salary_max
FROM job_search_view 
WHERE experience_level = '0-2 years' 
ORDER BY job_posted_date DESC;

-- 5. Search jobs by district (Ludhiana)
SELECT job_title, organization_name, taluk_name, job_type, qualification, experience_level, salary_min, salary_max
FROM job_search_view 
WHERE district_name = 'Ludhiana' 
ORDER BY salary_max DESC;

-- 6. Search jobs by salary range (300000-600000)
SELECT job_title, organization_name, district_name, job_type, qualification, salary_min, salary_max
FROM job_search_view 
WHERE salary_min >= 300000 AND salary_max <= 600000
ORDER BY salary_min DESC;

-- 7. Search jobs by organization type and location
SELECT job_title, organization_name, district_name, taluk_name, job_type, qualification, experience_level
FROM job_search_view 
WHERE job_type = 'Private' AND district_name = 'Amritsar'
ORDER BY job_posted_date DESC;

-- 8. Count jobs by type
SELECT job_type, COUNT(*) as job_count
FROM job_search_view 
GROUP BY job_type;

-- 9. Count jobs by qualification
SELECT qualification, COUNT(*) as job_count
FROM job_search_view 
GROUP BY qualification
ORDER BY job_count DESC;

-- 10. Count jobs by experience level
SELECT experience_level, COUNT(*) as job_count
FROM job_search_view 
GROUP BY experience_level
ORDER BY job_count DESC;

-- 11. Count jobs by district
SELECT district_name, COUNT(*) as job_count
FROM job_search_view 
GROUP BY district_name
ORDER BY job_count DESC;

-- 12. Average salary by job type
SELECT job_type, 
       AVG(salary_min) as avg_min_salary, 
       AVG(salary_max) as avg_max_salary
FROM job_search_view 
WHERE salary_min IS NOT NULL AND salary_max IS NOT NULL
GROUP BY job_type;

-- 13. Jobs expiring in next 30 days
SELECT job_title, organization_name, district_name, application_deadline,
       DATEDIFF(application_deadline, CURDATE()) as days_remaining
FROM job_search_view 
WHERE application_deadline BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY application_deadline;

-- 14. Complex search: Graduate jobs in Ludhiana with 2-5 years experience
SELECT job_title, organization_name, taluk_name, job_type, salary_min, salary_max, application_deadline
FROM job_search_view 
WHERE qualification = 'Graduate' 
  AND district_name = 'Ludhiana' 
  AND experience_level = '2-5 years'
ORDER BY salary_max DESC;

-- 15. Search by multiple criteria (like the form on the website)
-- This simulates the search form functionality
SELECT job_title, organization_name, district_name, taluk_name, job_type, 
       qualification, experience_level, salary_min, salary_max, application_deadline
FROM job_search_view 
WHERE job_type = 'Government'           -- Select job type
  AND qualification = 'Post Graduate'   -- Select Qualification  
  AND experience_level = '5-10 years'  -- Experience upto
  AND district_name = 'Patiala'        -- Place Of Posting
ORDER BY job_posted_date DESC;

-- 16. Statistics similar to the website
SELECT 
    (SELECT COUNT(*) FROM job_search_view WHERE job_type = 'Government') as 'Available Govt. Jobs',
    (SELECT COUNT(*) FROM job_search_view WHERE job_type = 'Private') as 'Available Private Jobs',
    (SELECT COUNT(*) FROM job_seekers) as 'Registered Job Seekers',
    (SELECT COUNT(*) FROM employers) as 'Registered Employers';

-- 17. Recent job postings (last 7 days)
SELECT job_title, organization_name, district_name, job_type, qualification, job_posted_date
FROM job_search_view 
WHERE job_posted_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY job_posted_date DESC;

-- 18. High salary jobs (top 10)
SELECT job_title, organization_name, district_name, job_type, qualification, 
       CONCAT('₹', FORMAT(salary_max, 0)) as max_salary
FROM job_search_view 
WHERE salary_max IS NOT NULL
ORDER BY salary_max DESC
LIMIT 10;

-- 19. Jobs by taluk (for detailed location search)
SELECT job_title, organization_name, taluk_name, district_name, job_type, qualification
FROM job_search_view 
WHERE taluk_name = 'Ludhiana East'
ORDER BY job_posted_date DESC;

-- 20. Employer-wise job count
SELECT organization_name, COUNT(*) as job_count
FROM job_search_view 
GROUP BY organization_name
ORDER BY job_count DESC
LIMIT 10;

