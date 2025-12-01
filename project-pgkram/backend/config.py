import os
from dotenv import load_dotenv

# ✅ Load environment variables from your .env file
load_dotenv()

# 🔐 Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:tiger@localhost:5432/punjab_job_portal")

# 🤖 Azure / GitHub AI Models Configuration
# Use Azure’s official endpoint — not models.github.ai
GITHUB_MODELS_ENDPOINT = os.getenv("GITHUB_MODELS_ENDPOINT", "https://models.inference.ai.azure.com")
GITHUB_MODELS_MODEL = os.getenv("GITHUB_MODELS_MODEL", "gpt-4o-mini")

# ⚠️ Do NOT hardcode secrets here — always load from .env
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    print("⚠️ Warning: GITHUB_TOKEN not found in environment variables!")

# 🔑 Secret key and auth configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-tokens-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

# 🌍 CORS Configuration — frontend URLs allowed to talk to backend
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# 💬 Chatbot prompt configuration
SYSTEM_PROMPT = """
You are a helpful job search assistant for the Punjab Job Portal. Your role is to help job seekers find relevant opportunities in Punjab, India.

Key Information:
- Available job types: Government, Private
- Qualifications: 12th Pass, Graduate, Post Graduate, Others
- Experience levels: 0-2 years, 2-5 years, 5-10 years, 10+ years
- All 25 districts of Punjab are covered

When users ask about jobs, provide specific recommendations from the database. Always be helpful, friendly, and informative about Punjab employment opportunities. If you don't have specific information, guide them on how to search effectively.

Keep responses concise but informative. Use bullet points for job listings and include salary ranges when available.
"""
