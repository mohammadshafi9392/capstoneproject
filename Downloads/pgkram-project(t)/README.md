# Punjab Naukari

A comprehensive job portal for Punjab, connecting job seekers with employment opportunities across government and private sectors.

## About

Punjab Naukari is a modern web application designed to enhance the PGKRAM (Punjab Government Kram) website, providing a seamless platform for job searching, applications, and career development in Punjab.

## Features

- **Job Search**: Search for government and private sector jobs across Punjab
- **User Dashboard**: Manage applications, profile, and job preferences
- **Analytics Dashboard**: Comprehensive analytics for administrators
- **AI-Powered Chatbot**: Intelligent job search assistance
- **Scholarship Information**: Access to scholarship opportunities
- **Professional Design**: Modern, responsive UI with professional color scheme

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Firebase Analytics

### Backend
- Python (Flask/FastAPI)
- PostgreSQL/MySQL Database
- WebSocket for real-time chatbot

## Project Structure

```
project-pgkram/
├── frontend/          # React frontend application
├── backend/           # Python backend API
├── database/          # Database setup scripts
└── README.md
```

## Getting Started

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup instructions.

## Jobs API & Data Flow

- `/api/jobs` – paginated listings with search, sorting, and filters (shared with analytics/chatbot datasets)
- `/api/jobs/{id}` – detailed job profile used on the Apply page
- `/api/jobs/{id}/apply` – persists applications in `job_applications` (tracked by email/phone)
- `/api/jobs/applications` – fetches application history for a user dashboard
- `/api/jobs/filters` – serves dropdown metadata (job types, districts, qualifications, experience)

### Frontend Integration Notes

- Set `VITE_BACKEND_URL` (defaults to `http://localhost:8000`) so both analytics and jobs views call the same API
- Jobs dashboard now reads/writes:
  - Listings/search → `/api/jobs`
  - Job detail/apply modal → `/api/jobs/{id}` and `/apply`
  - Saved jobs → local storage (`pn_saved_jobs`)
  - Applied jobs → `/api/jobs/applications` (email/phone driven)

These flows reuse the exact tables/views powering the chatbot and analytics dashboards to avoid duplicate data sources.

## License

This project is part of the Punjab Government initiative to enhance employment services.
