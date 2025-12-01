from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from pydantic import EmailStr, constr

class ChatMessage(BaseModel):
    message: str = Field(..., description="User message")
    session_id: Optional[str] = Field(None, description="Chat session ID")

class ChatResponse(BaseModel):
    success: bool = Field(..., description="Response success status")
    message: str = Field(..., description="AI response message")
    session_id: str = Field(..., description="Chat session ID")
    timestamp: str = Field(..., description="Response timestamp")

class JobSearchRequest(BaseModel):
    job_type: Optional[str] = Field(None, description="Job type: Government or Private")
    qualification: Optional[str] = Field(None, description="Qualification level")
    district: Optional[str] = Field(None, description="District name")
    experience: Optional[str] = Field(None, description="Experience level")
    limit: int = Field(10, description="Maximum number of results", ge=1, le=50)

class JobSearchResponse(BaseModel):
    success: bool = Field(..., description="Response success status")
    data: List[Dict[str, Any]] = Field(..., description="Job search results")
    count: int = Field(..., description="Number of results found")
    message: str = Field(..., description="Response message")


class JobSummary(BaseModel):
    id: int = Field(..., description="Unique job identifier")
    job_title: str = Field(..., description="Job title")
    organization_name: str = Field(..., description="Organization offering the job")
    job_type: str = Field(..., description="Job type label")
    qualification: str = Field(..., description="Required qualification")
    experience_level: str = Field(..., description="Experience band")
    district_name: str = Field(..., description="District where job is located")
    taluk_name: Optional[str] = Field(None, description="Taluk/Sub-district information")
    salary_min: Optional[float] = Field(None, description="Minimum salary")
    salary_max: Optional[float] = Field(None, description="Maximum salary")
    application_deadline: Optional[date] = Field(None, description="Application deadline")
    job_posted_date: Optional[datetime] = Field(None, description="Published date")
    job_description: Optional[str] = Field(None, description="Job description snippet")
    total_vacancies: Optional[int] = Field(None, description="Open positions")


class JobDetail(JobSummary):
    requirements: Optional[str] = Field(None, description="Job requirements")
    benefits: Optional[str] = Field(None, description="Job benefits")
    contact_details: Optional[str] = Field(None, description="Hiring contact details")


class PaginationMeta(BaseModel):
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Page size")
    total: int = Field(..., description="Total number of records")
    total_pages: int = Field(..., description="Total pages available")


class JobListResponse(BaseModel):
    success: bool = Field(..., description="Whether listing succeeded")
    data: List[JobSummary] = Field(..., description="List of jobs")
    pagination: PaginationMeta = Field(..., description="Pagination metadata")


class JobDetailResponse(BaseModel):
    success: bool = Field(..., description="Whether fetch succeeded")
    data: JobDetail = Field(..., description="Job detail payload")


class JobApplicationRequest(BaseModel):
    applicant_name: str = Field(..., description="Applicant full name", min_length=2)
    email: str = Field(..., description="Applicant email")
    phone: Optional[str] = Field(None, description="Applicant phone number")
    resume_url: Optional[str] = Field(None, description="URL to resume or portfolio")
    cover_letter: Optional[str] = Field(None, description="Cover letter text")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional context data")


class JobApplicationResponse(BaseModel):
    success: bool = Field(..., description="Whether application succeeded")
    application_id: int = Field(..., description="Created application ID")
    job_id: int = Field(..., description="Associated job ID")
    message: str = Field(..., description="User-friendly message")


class JobApplicationItem(BaseModel):
    id: int = Field(..., description="Application identifier")
    job_id: int = Field(..., description="Related job ID")
    applicant_name: str = Field(..., description="Applicant name")
    email: str = Field(..., description="Applicant email")
    phone: Optional[str] = Field(None, description="Applicant phone")
    resume_url: Optional[str] = Field(None, description="Resume URL")
    cover_letter: Optional[str] = Field(None, description="Cover letter text")
    status: str = Field(..., description="Application status")
    created_at: datetime = Field(..., description="Creation timestamp")
    job_title: str = Field(..., description="Job title")
    organization_name: str = Field(..., description="Organization name")
    job_type: str = Field(..., description="Job type label")
    application_deadline: Optional[date] = Field(None, description="Deadline for the job")


class JobApplicationListResponse(BaseModel):
    success: bool = Field(..., description="Whether retrieval succeeded")
    data: List[JobApplicationItem] = Field(..., description="Applications data")
    count: int = Field(..., description="Total number of applications returned")


class JobMutationResponse(BaseModel):
    success: bool = Field(..., description="Mutation status")
    job_id: int = Field(..., description="Affected job ID")
    message: str = Field(..., description="Mutation summary")


class JobCreateRequest(BaseModel):
    job_title: str = Field(..., description="Job title")
    job_description: Optional[str] = Field(None, description="Detailed description")
    organization_name: str = Field(..., description="Organization name")
    employer_id: Optional[int] = Field(None, description="Employer reference ID")
    job_type_id: int = Field(..., description="Job type ID")
    qualification_id: int = Field(..., description="Qualification ID")
    experience_level_id: int = Field(..., description="Experience level ID")
    district_id: int = Field(..., description="District ID")
    taluk_id: Optional[int] = Field(None, description="Taluk ID")
    salary_min: Optional[float] = Field(None, description="Minimum salary")
    salary_max: Optional[float] = Field(None, description="Maximum salary")
    salary_currency: Optional[str] = Field("INR", description="Salary currency code")
    application_deadline: Optional[date] = Field(None, description="Application deadline")
    total_vacancies: Optional[int] = Field(1, description="Vacancy count")
    requirements: Optional[str] = Field(None, description="Requirements text")
    benefits: Optional[str] = Field(None, description="Benefits text")
    contact_details: Optional[str] = Field(None, description="Contact details")
    is_active: Optional[bool] = Field(True, description="Job active flag")


class JobUpdateRequest(BaseModel):
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    organization_name: Optional[str] = None
    employer_id: Optional[int] = None
    job_type_id: Optional[int] = None
    qualification_id: Optional[int] = None
    experience_level_id: Optional[int] = None
    district_id: Optional[int] = None
    taluk_id: Optional[int] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: Optional[str] = None
    application_deadline: Optional[date] = None
    total_vacancies: Optional[int] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    contact_details: Optional[str] = None
    is_active: Optional[bool] = None


class JobFilterOptions(BaseModel):
    job_types: List[Dict[str, Any]] = Field(..., description="Available job types")
    qualifications: List[Dict[str, Any]] = Field(..., description="Available qualifications")
    experience_levels: List[Dict[str, Any]] = Field(..., description="Experience level options")
    districts: List[Dict[str, Any]] = Field(..., description="District list")


class UserRegisterRequest(BaseModel):
    full_name: constr(min_length=2, max_length=150) = Field(..., description="Full name")
    email: EmailStr = Field(..., description="User email")
    phone: constr(min_length=6, max_length=20) = Field(..., description="Phone number")
    password: constr(min_length=8, max_length=128) = Field(..., description="Account password")
    role: Optional[str] = Field("user", description="User role")


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email")
    password: constr(min_length=8, max_length=128) = Field(..., description="Account password")


class UserProfile(BaseModel):
    id: int = Field(..., description="User identifier")
    full_name: str = Field(..., description="Full name")
    email: EmailStr = Field(..., description="User email")
    phone: Optional[str] = Field(None, description="Phone number")
    role: str = Field(..., description="User role")


class AuthResponse(BaseModel):
    success: bool = Field(..., description="Whether auth succeeded")
    message: str = Field(..., description="Response summary")
    token_expires_in: int = Field(..., description="Expiry in seconds")
    user: UserProfile = Field(..., description="Authenticated user profile")

class WebSocketMessage(BaseModel):
    type: str = Field(..., description="Message type: user_message, bot_message, typing")
    message: str = Field(..., description="Message content")
    timestamp: Optional[str] = Field(None, description="Message timestamp")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class ChatSession(BaseModel):
    session_id: str = Field(..., description="Unique session identifier")
    user_ip: Optional[str] = Field(None, description="User IP address")
    created_at: datetime = Field(..., description="Session creation timestamp")
    last_activity: datetime = Field(..., description="Last activity timestamp")

class ChatHistoryItem(BaseModel):
    message_type: str = Field(..., description="Message type: user or bot")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(..., description="Message timestamp")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Message metadata")

class UserPreferences(BaseModel):
    job_type: Optional[str] = Field(None, description="Preferred job type")
    preferred_districts: Optional[List[int]] = Field(None, description="Preferred district IDs")
    experience_level: Optional[str] = Field(None, description="Experience level")
    qualification: Optional[str] = Field(None, description="Qualification level")
    salary_range: Optional[Dict[str, float]] = Field(None, description="Salary range preferences")



