from datetime import datetime, timedelta
from collections import deque, defaultdict
import html
import re

from fastapi import APIRouter, HTTPException, Depends, Response, Request
from jose import jwt
from passlib.context import CryptContext
import asyncpg

from config import SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, COOKIE_SECURE
from database import db_manager
from models import UserRegisterRequest, UserLoginRequest, AuthResponse, UserProfile


router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW_SECONDS = 60
rate_limit_store = defaultdict(deque)


def sanitize_text(value: str) -> str:
    """Basic sanitization to reduce XSS risk."""
    return html.escape(value.strip())


def sanitize_phone(value: str) -> str:
    """Keep digits and plus sign only."""
    return re.sub(r"[^\d+]", "", value)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)


async def rate_limiter(request: Request):
    client_ip = request.client.host if request.client else "anonymous"
    now = datetime.utcnow().timestamp()
    timestamps = rate_limit_store[client_ip]

    # Remove timestamps outside the window
    while timestamps and now - timestamps[0] > RATE_LIMIT_WINDOW_SECONDS:
        timestamps.popleft()

    if len(timestamps) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")

    timestamps.append(now)


def build_cookie_options():
    return {
        "httponly": True,
        "secure": COOKIE_SECURE,
        "samesite": "lax",
        "max_age": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "expires": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


def serialize_user(raw_user: dict) -> UserProfile:
    return UserProfile(
        id=raw_user["id"],
        full_name=raw_user["full_name"],
        email=raw_user["email"],
        phone=raw_user.get("phone"),
        role=raw_user["role"]
    )


@router.post("/register", response_model=AuthResponse, dependencies=[Depends(rate_limiter)])
async def register_user(payload: UserRegisterRequest, response: Response):
    """Register a new user and issue JWT token."""
    if not db_manager.users_table_ready:
        await db_manager.create_user_table()

    email = payload.email.lower()
    try:
        existing_user = await db_manager.get_user_by_email(email)
        if existing_user:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")

        role = payload.role.lower() if payload.role else "user"
        if role not in {"user", "admin"}:
            role = "user"

        sanitized_name = sanitize_text(payload.full_name)
        sanitized_phone = sanitize_phone(payload.phone)
        hashed_password = pwd_context.hash(payload.password)

        user_record = await db_manager.create_user(
            full_name=sanitized_name,
            email=email,
            phone=sanitized_phone,
            hashed_password=hashed_password,
            role=role
        )
    except HTTPException:
        raise
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    except Exception as exc:
        print(f"❌ Registration error: {exc}")
        raise HTTPException(status_code=500, detail="Unable to create account. Please try again later.")

    token = create_access_token({"sub": str(user_record["id"]), "email": email, "role": user_record["role"]})
    response.set_cookie("access_token", token, **build_cookie_options())

    return AuthResponse(
        success=True,
        message="Registration successful",
        token_expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=serialize_user(user_record)
    )


@router.post("/login", response_model=AuthResponse, dependencies=[Depends(rate_limiter)])
async def login_user(payload: UserLoginRequest, response: Response):
    """Authenticate existing user and issue JWT token."""
    if not db_manager.users_table_ready:
        await db_manager.create_user_table()

    email = payload.email.lower()
    try:
        user_record = await db_manager.get_user_by_email(email)
        if not user_record:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        if not pwd_context.verify(payload.password, user_record["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
    except HTTPException:
        raise
    except Exception as exc:
        print(f"❌ Login error: {exc}")
        raise HTTPException(status_code=500, detail="Unable to process login. Please try again later.")

    token = create_access_token({"sub": str(user_record["id"]), "email": email, "role": user_record["role"]})
    response.set_cookie("access_token", token, **build_cookie_options())

    return AuthResponse(
        success=True,
        message="Login successful",
        token_expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=serialize_user(user_record)
    )

