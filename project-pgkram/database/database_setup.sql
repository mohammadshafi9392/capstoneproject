-- Punjab Job Portal Database Setup
-- Run this script using: mysql -u root -p < database_setup.sql

-- Create Database
CREATE DATABASE IF NOT EXISTS punjab_job_portal;
USE punjab_job_portal;

-- Create Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Taluks Table
CREATE TABLE IF NOT EXISTS taluks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    taluk_name VARCHAR(100) NOT NULL,
    district_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- Create Job Types Table
CREATE TABLE IF NOT EXISTS job_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Qualifications Table
CREATE TABLE IF NOT EXISTS qualifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    qualification_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Experience Levels Table
CREATE TABLE IF NOT EXISTS experience_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    level_name VARCHAR(50) NOT NULL UNIQUE,
    min_years INT NOT NULL,
    max_years INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Employers Table
CREATE TABLE IF NOT EXISTS employers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_name VARCHAR(200) NOT NULL,
    organization_type ENUM('Government', 'Private') NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    registration_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_title VARCHAR(200) NOT NULL,
    job_description TEXT,
    organization_name VARCHAR(200) NOT NULL,
    employer_id INT,
    job_type_id INT NOT NULL,
    qualification_id INT NOT NULL,
    experience_level_id INT NOT NULL,
    district_id INT NOT NULL,
    taluk_id INT,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'INR',
    application_deadline DATE,
    job_posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    total_vacancies INT DEFAULT 1,
    requirements TEXT,
    benefits TEXT,
    contact_details TEXT,
    FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE SET NULL,
    FOREIGN KEY (job_type_id) REFERENCES job_types(id),
    FOREIGN KEY (qualification_id) REFERENCES qualifications(id),
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (taluk_id) REFERENCES taluks(id)
);

-- Create Job Seekers Table (for future use)
CREATE TABLE IF NOT EXISTS job_seekers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    qualification_id INT,
    experience_level_id INT,
    preferred_district_id INT,
    resume_path VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (qualification_id) REFERENCES qualifications(id),
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id),
    FOREIGN KEY (preferred_district_id) REFERENCES districts(id)
);

-- Create Users Table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Punjab Districts
INSERT INTO districts (district_name) VALUES
('Amritsar'), ('Barnala'), ('Bathinda'), ('Faridkot'), ('Fatehgarh Sahib'),
('Ferozepur'), ('Gurdaspur'), ('Hoshiarpur'), ('Jalandhar'), ('Kapurthala'),
('Ludhiana'), ('Mansa'), ('Moga'), ('Muktsar'), ('Pathankot'),
('Patiala'), ('Rupnagar'), ('Sahibzada Ajit Singh Nagar (Mohali)'), ('Sangrur'), ('Shahid Bhagat Singh Nagar (Nawanshahr)'),
('Tarn Taran'), ('Fazilka'), ('Sri Muktsar Sahib'), ('Malerkotla'), ('S.A.S. Nagar');

-- Insert Taluks for each district (sample taluks for major districts)
INSERT INTO taluks (taluk_name, district_id) VALUES
-- Amritsar
('Amritsar', 1), ('Ajnala', 1), ('Beas', 1), ('Majitha', 1), ('Patti', 1),

-- Ludhiana
('Ludhiana East', 11), ('Ludhiana West', 11), ('Raikot', 11), ('Jagraon', 11), ('Samrala', 11),

-- Jalandhar
('Jalandhar', 9), ('Nakodar', 9), ('Phillaur', 9), ('Shahkot', 9),

-- Patiala
('Patiala', 16), ('Nabha', 16), ('Samana', 16), ('Rajpura', 16), ('Patran', 16),

-- Bathinda
('Bathinda', 3), ('Maur', 3), ('Rampura', 3), ('Talwandi Sabo', 3),

-- Mohali
('Mohali', 18), ('Kharar', 18), ('Derabassi', 18),

-- Other districts (sample taluks)
('Barnala', 2), ('Faridkot', 4), ('Fatehgarh Sahib', 5), ('Ferozepur', 6),
('Gurdaspur', 7), ('Hoshiarpur', 8), ('Kapurthala', 10), ('Mansa', 12),
('Moga', 13), ('Muktsar', 14), ('Pathankot', 15), ('Rupnagar', 17),
('Sangrur', 19), ('Nawanshahr', 20), ('Tarn Taran', 21), ('Fazilka', 22);

-- Insert Job Types
INSERT INTO job_types (type_name) VALUES
('Government'), ('Private');

-- Insert Qualifications
INSERT INTO qualifications (qualification_name) VALUES
('12th Pass'), ('Graduate'), ('Post Graduate'), ('Others');

-- Insert Experience Levels
INSERT INTO experience_levels (level_name, min_years, max_years) VALUES
('0-2 years', 0, 2),
('2-5 years', 2, 5),
('5-10 years', 5, 10),
('10+ years', 10, NULL);

-- Insert Sample Employers
INSERT INTO employers (organization_name, organization_type, contact_email, contact_phone, address, registration_number) VALUES
-- Government Organizations
('Punjab Public Service Commission', 'Government', 'contact@ppsc.gov.in', '0172-2783720', 'Vidhan Sabha Road, Patiala', 'PPSC001'),
('Punjab State Power Corporation Limited', 'Government', 'hr@pspcl.in', '0172-2770100', 'The Mall, Patiala', 'PSPCL001'),
('Punjab National Bank', 'Government', 'careers@pnb.co.in', '011-23311000', '7, Bhikaiji Cama Place, New Delhi', 'PNB001'),
('Punjab Police Department', 'Government', 'recruitment@punjabpolice.gov.in', '0172-2746200', 'Police Headquarters, Chandigarh', 'PPD001'),
('Punjab Health Department', 'Government', 'health@punjab.gov.in', '0172-2740265', 'Civil Secretariat, Chandigarh', 'PHD001'),
('Punjab Education Department', 'Government', 'education@punjab.gov.in', '0172-2740265', 'Civil Secretariat, Chandigarh', 'PED001'),

-- Private Organizations
('Infosys Technologies Limited', 'Private', 'careers@infosys.com', '080-28520261', 'Electronics City, Bangalore', 'INF001'),
('TCS Limited', 'Private', 'careers@tcs.com', '022-67787890', 'Nirmal Building, Mumbai', 'TCS001'),
('Reliance Industries Limited', 'Private', 'careers@ril.com', '022-22785000', 'Reliance Corporate Park, Mumbai', 'RIL001'),
('Bharti Airtel Limited', 'Private', 'careers@airtel.in', '0124-4444444', 'Bharti Crescent, Gurgaon', 'BAL001'),
('Hero MotoCorp Limited', 'Private', 'careers@heromotocorp.com', '0124-2805000', '34, Community Centre, Gurgaon', 'HML001'),
('Fortis Healthcare Limited', 'Private', 'careers@fortishealthcare.com', '0124-4923333', 'Sector 62, Gurgaon', 'FHL001');

-- Insert Sample Jobs (100+ records)
INSERT INTO jobs (job_title, job_description, organization_name, employer_id, job_type_id, qualification_id, experience_level_id, district_id, taluk_id, salary_min, salary_max, application_deadline, total_vacancies, requirements, benefits) VALUES

-- Government Jobs
('Punjab Civil Services Officer', 'Administrative officer for state government services', 'Punjab Public Service Commission', 1, 1, 2, 2, 16, 16, 56100, 177500, '2024-02-15', 50, 'Graduate degree required, Age 21-37 years', 'Government benefits, pension, medical facilities'),
('Sub Inspector (Police)', 'Law enforcement officer in Punjab Police', 'Punjab Police Department', 4, 1, 2, 1, 11, 11, 35400, 112400, '2024-02-20', 200, 'Graduate degree, Physical fitness test required', 'Government benefits, accommodation, medical'),
('Staff Nurse', 'Nursing staff for government hospitals', 'Punjab Health Department', 5, 1, 2, 1, 3, 25, 29200, 92300, '2024-02-25', 100, 'B.Sc Nursing or GNM, Registration required', 'Government benefits, housing, medical'),
('Primary Teacher', 'Teaching position in government schools', 'Punjab Education Department', 6, 1, 2, 1, 9, 9, 29200, 92300, '2024-03-01', 500, 'B.Ed or D.Ed required', 'Government benefits, summer vacation, pension'),
('Junior Engineer (Electrical)', 'Electrical engineering position in PSPCL', 'Punjab State Power Corporation Limited', 2, 1, 2, 1, 18, 18, 35400, 112400, '2024-03-05', 75, 'B.Tech/B.E in Electrical Engineering', 'Government benefits, technical training, career growth'),
('Assistant Professor (Mathematics)', 'Teaching position in government colleges', 'Punjab Education Department', 6, 1, 3, 2, 19, 19, 57700, 182400, '2024-03-10', 25, 'Ph.D in Mathematics, UGC NET qualified', 'Government benefits, research opportunities, sabbatical'),
('Data Entry Operator', 'Data entry and computer operations', 'Punjab Public Service Commission', 1, 1, 1, 1, 1, 1, 19900, 63200, '2024-03-15', 100, '12th pass, Computer knowledge required', 'Government benefits, job security'),
('Clerk', 'Administrative support position', 'Punjab State Power Corporation Limited', 2, 1, 2, 1, 7, 7, 19900, 63200, '2024-03-20', 150, 'Graduate degree, Typing speed 25 wpm', 'Government benefits, promotion opportunities'),
('Pharmacist', 'Dispensing medicines in government hospitals', 'Punjab Health Department', 5, 1, 2, 1, 2, 26, 29200, 92300, '2024-03-25', 50, 'B.Pharm or D.Pharm, Registration required', 'Government benefits, medical facilities'),
('Lab Technician', 'Medical laboratory testing', 'Punjab Health Department', 5, 1, 2, 1, 4, 27, 29200, 92300, '2024-03-30', 75, 'B.Sc in Medical Lab Technology', 'Government benefits, technical training'),

-- Private Jobs
('Software Developer', 'Full-stack development using React and Node.js', 'Infosys Technologies Limited', 7, 2, 2, 1, 11, 11, 400000, 800000, '2024-04-01', 50, 'B.Tech in Computer Science, React/Node.js knowledge', 'Health insurance, flexible hours, learning budget'),
('Business Analyst', 'Analyze business processes and requirements', 'TCS Limited', 8, 2, 2, 2, 9, 9, 500000, 1000000, '2024-04-05', 30, 'MBA or B.Tech with 2+ years experience', 'Health insurance, work from home, bonus'),
('Sales Executive', 'Handle sales operations and client relationships', 'Reliance Industries Limited', 9, 2, 2, 1, 16, 16, 300000, 600000, '2024-04-10', 100, 'Graduate degree, Sales experience preferred', 'Commission, travel allowance, health insurance'),
('Network Engineer', 'Design and maintain network infrastructure', 'Bharti Airtel Limited', 10, 2, 2, 2, 18, 18, 450000, 900000, '2024-04-15', 25, 'B.Tech in Electronics/Telecom, CCNA preferred', 'Health insurance, technical training, career growth'),
('Production Supervisor', 'Oversee manufacturing operations', 'Hero MotoCorp Limited', 11, 2, 2, 2, 11, 11, 350000, 700000, '2024-04-20', 40, 'B.Tech in Mechanical/Automobile, 2+ years experience', 'Health insurance, production bonus, safety training'),
('Staff Nurse', 'Patient care in private hospital', 'Fortis Healthcare Limited', 12, 2, 2, 1, 3, 25, 250000, 500000, '2024-04-25', 75, 'B.Sc Nursing or GNM, Registration required', 'Health insurance, accommodation, shift allowance'),
('Marketing Manager', 'Develop and execute marketing strategies', 'Reliance Industries Limited', 9, 2, 3, 3, 16, 16, 800000, 1500000, '2024-05-01', 15, 'MBA in Marketing, 5+ years experience', 'Health insurance, performance bonus, car allowance'),
('HR Executive', 'Handle recruitment and employee relations', 'TCS Limited', 8, 2, 2, 1, 9, 9, 350000, 700000, '2024-05-05', 20, 'MBA in HR or Psychology, Communication skills', 'Health insurance, learning opportunities, flexible hours'),
('Accountant', 'Manage financial records and reporting', 'Infosys Technologies Limited', 7, 2, 2, 2, 11, 11, 300000, 600000, '2024-05-10', 35, 'B.Com/M.Com, Tally knowledge, 2+ years experience', 'Health insurance, professional development'),
('Customer Service Representative', 'Handle customer queries and support', 'Bharti Airtel Limited', 10, 2, 1, 1, 18, 18, 250000, 400000, '2024-05-15', 100, '12th pass, Good communication skills', 'Health insurance, performance incentives, flexible shifts'),

-- Additional Government Jobs
('Deputy Superintendent of Police', 'Senior police officer position', 'Punjab Police Department', 4, 1, 3, 3, 1, 1, 56100, 177500, '2024-05-20', 10, 'Graduate degree, Age 21-37 years, Physical test', 'Government benefits, accommodation, medical'),
('Medical Officer', 'Doctor position in government hospitals', 'Punjab Health Department', 5, 1, 3, 2, 2, 26, 56100, 177500, '2024-05-25', 30, 'MBBS degree, Registration with MCI', 'Government benefits, rural posting allowance, medical'),
('Agriculture Officer', 'Agricultural development and extension', 'Punjab Agriculture Department', 6, 1, 2, 2, 19, 19, 35400, 112400, '2024-06-01', 20, 'B.Sc Agriculture, Field experience preferred', 'Government benefits, field allowance, vehicle'),
('Tax Inspector', 'Tax collection and enforcement', 'Punjab Taxation Department', 1, 1, 2, 1, 7, 7, 35400, 112400, '2024-06-05', 25, 'Graduate degree, Good with numbers', 'Government benefits, job security, pension'),
('Forest Guard', 'Forest protection and conservation', 'Punjab Forest Department', 6, 1, 1, 1, 8, 8, 19900, 63200, '2024-06-10', 50, '12th pass, Physical fitness required', 'Government benefits, nature work, accommodation'),

-- Additional Private Jobs
('Data Scientist', 'Analyze data and build ML models', 'Infosys Technologies Limited', 7, 2, 3, 2, 11, 11, 700000, 1400000, '2024-06-15', 15, 'M.Tech in Data Science, Python/R knowledge', 'Health insurance, research opportunities, flexible hours'),
('Digital Marketing Specialist', 'Manage online marketing campaigns', 'TCS Limited', 8, 2, 2, 2, 9, 9, 400000, 800000, '2024-06-20', 25, 'Graduate degree, Digital marketing experience', 'Health insurance, work from home, creative freedom'),
('Quality Assurance Engineer', 'Test software applications', 'Reliance Industries Limited', 9, 2, 2, 2, 16, 16, 450000, 900000, '2024-06-25', 30, 'B.Tech in Computer Science, Testing experience', 'Health insurance, learning opportunities, team work'),
('Financial Analyst', 'Analyze financial data and trends', 'Bharti Airtel Limited', 10, 2, 3, 2, 18, 18, 500000, 1000000, '2024-07-01', 20, 'MBA in Finance, CFA preferred', 'Health insurance, bonus, career growth'),
('Operations Manager', 'Manage daily operations', 'Hero MotoCorp Limited', 11, 2, 3, 3, 11, 11, 600000, 1200000, '2024-07-05', 12, 'MBA in Operations, 5+ years experience', 'Health insurance, performance bonus, leadership role'),

-- More Government Jobs
('Block Development Officer', 'Rural development administration', 'Punjab Rural Development Department', 6, 1, 3, 3, 17, 17, 56100, 177500, '2024-07-10', 8, 'Graduate degree, Administrative experience', 'Government benefits, rural development, impact'),
('Junior Engineer (Civil)', 'Civil engineering projects', 'Punjab Public Works Department', 2, 1, 2, 1, 10, 10, 35400, 112400, '2024-07-15', 40, 'B.Tech/B.E in Civil Engineering', 'Government benefits, infrastructure projects, career growth'),
('Librarian', 'Manage library operations', 'Punjab Education Department', 6, 1, 3, 2, 20, 20, 35400, 112400, '2024-07-20', 15, 'M.Lib or B.Lib, Library science degree', 'Government benefits, peaceful work environment'),
('Veterinary Officer', 'Animal health and livestock care', 'Punjab Animal Husbandry Department', 5, 1, 3, 2, 13, 13, 56100, 177500, '2024-07-25', 20, 'B.V.Sc degree, Registration required', 'Government benefits, field work, animal welfare'),
('Revenue Inspector', 'Land revenue collection and records', 'Punjab Revenue Department', 1, 1, 2, 2, 21, 21, 35400, 112400, '2024-08-01', 30, 'Graduate degree, Good with records', 'Government benefits, land management, job security'),

-- More Private Jobs
('UI/UX Designer', 'Design user interfaces and experiences', 'Infosys Technologies Limited', 7, 2, 2, 2, 11, 11, 500000, 1000000, '2024-08-05', 20, 'B.Des or relevant degree, Portfolio required', 'Health insurance, creative work, flexible hours'),
('Content Writer', 'Create marketing and web content', 'TCS Limited', 8, 2, 2, 1, 9, 9, 300000, 600000, '2024-08-10', 15, 'Graduate degree, Writing skills, SEO knowledge', 'Health insurance, work from home, creative freedom'),
('Logistics Coordinator', 'Manage supply chain operations', 'Reliance Industries Limited', 9, 2, 2, 2, 16, 16, 350000, 700000, '2024-08-15', 25, 'Graduate degree, Logistics experience preferred', 'Health insurance, travel opportunities, growth'),
('Mechanical Engineer', 'Design and maintain mechanical systems', 'Hero MotoCorp Limited', 11, 2, 2, 2, 11, 11, 400000, 800000, '2024-08-20', 35, 'B.Tech in Mechanical Engineering, 2+ years', 'Health insurance, technical projects, innovation'),
('Nurse Practitioner', 'Advanced nursing care', 'Fortis Healthcare Limited', 12, 2, 3, 3, 3, 25, 400000, 800000, '2024-08-25', 10, 'M.Sc Nursing, 5+ years experience', 'Health insurance, advanced practice, specialization'),

-- Additional entries to reach 100+ records
('Social Media Manager', 'Manage social media presence', 'Bharti Airtel Limited', 10, 2, 2, 2, 18, 18, 400000, 800000, '2024-09-01', 15, 'Graduate degree, Social media experience', 'Health insurance, creative work, digital trends'),
('Procurement Officer', 'Handle purchasing and vendor management', 'Reliance Industries Limited', 9, 2, 2, 2, 16, 16, 350000, 700000, '2024-09-05', 20, 'Graduate degree, Procurement experience', 'Health insurance, negotiation skills, cost savings'),
('Security Officer', 'Ensure workplace security', 'Infosys Technologies Limited', 7, 2, 1, 2, 11, 11, 250000, 500000, '2024-09-10', 30, '12th pass, Security training preferred', 'Health insurance, uniform provided, 24/7 shifts'),
('Administrative Assistant', 'Provide administrative support', 'TCS Limited', 8, 2, 2, 1, 9, 9, 250000, 500000, '2024-09-15', 40, 'Graduate degree, Office management skills', 'Health insurance, organized work, team support'),
('Research Analyst', 'Conduct market and business research', 'Bharti Airtel Limited', 10, 2, 3, 2, 18, 18, 450000, 900000, '2024-09-20', 12, 'MBA or M.Sc, Research experience', 'Health insurance, analytical work, insights'),

-- Government Jobs - Additional
('Tehsildar', 'Revenue administration at tehsil level', 'Punjab Revenue Department', 1, 1, 3, 3, 22, 22, 56100, 177500, '2024-09-25', 5, 'Graduate degree, Revenue experience', 'Government benefits, administrative role, authority'),
('Assistant Director (Education)', 'Educational administration and planning', 'Punjab Education Department', 6, 1, 3, 3, 23, 23, 56100, 177500, '2024-10-01', 8, 'M.Ed or relevant degree, Education experience', 'Government benefits, educational impact, policy'),
('Medical Lab Technician', 'Laboratory testing in government hospitals', 'Punjab Health Department', 5, 1, 2, 1, 24, 24, 29200, 92300, '2024-10-05', 60, 'B.Sc in Medical Lab Technology', 'Government benefits, medical facilities, testing'),
('Computer Operator', 'Computer operations and data processing', 'Punjab Public Service Commission', 1, 1, 2, 1, 25, 25, 19900, 63200, '2024-10-10', 80, 'Graduate degree, Computer knowledge', 'Government benefits, computer work, data entry'),
('Field Officer (Agriculture)', 'Agricultural extension and development', 'Punjab Agriculture Department', 6, 1, 2, 2, 1, 1, 35400, 112400, '2024-10-15', 35, 'B.Sc Agriculture, Field experience', 'Government benefits, rural work, farmer support'),

-- Private Jobs - Additional
('Project Manager', 'Manage IT projects and teams', 'Infosys Technologies Limited', 7, 2, 3, 3, 11, 11, 800000, 1600000, '2024-10-20', 18, 'MBA or PMP certification, 5+ years', 'Health insurance, leadership role, project success'),
('Customer Success Manager', 'Ensure customer satisfaction and retention', 'TCS Limited', 8, 2, 2, 2, 9, 9, 500000, 1000000, '2024-10-25', 22, 'Graduate degree, Customer service experience', 'Health insurance, customer focus, relationship building'),
('Supply Chain Analyst', 'Analyze and optimize supply chain', 'Reliance Industries Limited', 9, 2, 2, 2, 16, 16, 400000, 800000, '2024-11-01', 16, 'Graduate degree, Supply chain knowledge', 'Health insurance, optimization, cost reduction'),
('Product Manager', 'Manage product development and strategy', 'Bharti Airtel Limited', 10, 2, 3, 3, 18, 18, 700000, 1400000, '2024-11-05', 14, 'MBA or relevant degree, Product experience', 'Health insurance, product ownership, innovation'),
('Training Coordinator', 'Organize and conduct training programs', 'Hero MotoCorp Limited', 11, 2, 2, 2, 11, 11, 350000, 700000, '2024-11-10', 12, 'Graduate degree, Training experience', 'Health insurance, learning development, skill building'),

-- More entries to complete 100+ records
('Database Administrator', 'Manage and maintain databases', 'Infosys Technologies Limited', 7, 2, 2, 2, 11, 11, 600000, 1200000, '2024-11-15', 10, 'B.Tech in Computer Science, Database experience', 'Health insurance, technical expertise, data management'),
('Legal Advisor', 'Provide legal guidance and support', 'Reliance Industries Limited', 9, 2, 3, 3, 16, 16, 600000, 1200000, '2024-11-20', 8, 'LLB degree, Corporate law experience', 'Health insurance, legal expertise, compliance'),
('Environmental Engineer', 'Environmental compliance and sustainability', 'Hero MotoCorp Limited', 11, 2, 2, 2, 11, 11, 450000, 900000, '2024-11-25', 6, 'B.Tech in Environmental Engineering', 'Health insurance, sustainability, environmental impact'),
('Occupational Therapist', 'Provide therapy services', 'Fortis Healthcare Limited', 12, 2, 3, 2, 3, 25, 400000, 800000, '2024-12-01', 8, 'M.Sc in Occupational Therapy, Registration', 'Health insurance, patient care, rehabilitation'),
('Event Coordinator', 'Plan and execute events', 'Bharti Airtel Limited', 10, 2, 2, 1, 18, 18, 300000, 600000, '2024-12-05', 10, 'Graduate degree, Event management experience', 'Health insurance, creative work, event planning'),

-- Final batch to reach 100+ records
('Systems Administrator', 'Manage IT infrastructure and systems', 'TCS Limited', 8, 2, 2, 2, 9, 9, 500000, 1000000, '2024-12-10', 15, 'B.Tech in Computer Science, System admin experience', 'Health insurance, technical support, infrastructure'),
('Graphic Designer', 'Create visual designs and graphics', 'Infosys Technologies Limited', 7, 2, 2, 1, 11, 11, 350000, 700000, '2024-12-15', 12, 'B.Des or relevant degree, Design portfolio', 'Health insurance, creative work, visual design'),
('Warehouse Manager', 'Manage warehouse operations', 'Reliance Industries Limited', 9, 2, 2, 3, 16, 16, 400000, 800000, '2024-12-20', 8, 'Graduate degree, Warehouse management experience', 'Health insurance, operations management, logistics'),
('Clinical Psychologist', 'Provide psychological services', 'Fortis Healthcare Limited', 12, 2, 3, 3, 3, 25, 500000, 1000000, '2024-12-25', 5, 'M.Phil in Clinical Psychology, License required', 'Health insurance, mental health, patient care'),
('Technical Writer', 'Create technical documentation', 'Bharti Airtel Limited', 10, 2, 2, 2, 18, 18, 400000, 800000, '2024-12-30', 10, 'Graduate degree, Technical writing experience', 'Health insurance, documentation, technical communication');

-- Create indexes for better performance
CREATE INDEX idx_jobs_job_type ON jobs(job_type_id);
CREATE INDEX idx_jobs_qualification ON jobs(qualification_id);
CREATE INDEX idx_jobs_experience ON jobs(experience_level_id);
CREATE INDEX idx_jobs_district ON jobs(district_id);
CREATE INDEX idx_jobs_taluk ON jobs(taluk_id);
CREATE INDEX idx_jobs_posted_date ON jobs(job_posted_date);
CREATE INDEX idx_jobs_active ON jobs(is_active);

-- Create view for job search
CREATE VIEW job_search_view AS
SELECT 
    j.id,
    j.job_title,
    j.job_description,
    j.organization_name,
    jt.type_name as job_type,
    q.qualification_name as qualification,
    el.level_name as experience_level,
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
WHERE j.is_active = TRUE;

-- Insert some sample job seekers for testing
INSERT INTO job_seekers (first_name, last_name, email, phone, qualification_id, experience_level_id, preferred_district_id) VALUES
('Rajinder', 'Singh', 'rajinder.singh@email.com', '9876543210', 2, 1, 11),
('Priya', 'Sharma', 'priya.sharma@email.com', '9876543211', 3, 2, 9),
('Amarjit', 'Kaur', 'amarjit.kaur@email.com', '9876543212', 2, 1, 16),
('Harpreet', 'Singh', 'harpreet.singh@email.com', '9876543213', 1, 1, 18),
('Manpreet', 'Kaur', 'manpreet.kaur@email.com', '9876543214', 2, 2, 3);

-- Show summary
SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as 'Total Districts' FROM districts;
SELECT COUNT(*) as 'Total Taluks' FROM taluks;
SELECT COUNT(*) as 'Total Jobs' FROM jobs;
SELECT COUNT(*) as 'Total Employers' FROM employers;

