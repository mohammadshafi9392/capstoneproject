from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import math

from database import db_manager
from models import (
    JobListResponse,
    JobDetailResponse,
    JobApplicationRequest,
    JobApplicationResponse,
    JobApplicationListResponse,
    JobCreateRequest,
    JobUpdateRequest,
    JobMutationResponse,
    JobFilterOptions,
    PaginationMeta,
)


router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/filters", response_model=JobFilterOptions)
async def fetch_job_filters():
    """Return dropdown metadata sourced from the canonical tables."""
    try:
        options = await db_manager.get_job_filter_options()
        return JobFilterOptions(**options)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching filters: {str(e)}")


@router.get("/applications", response_model=JobApplicationListResponse)
async def fetch_applications(email: Optional[str] = None, phone: Optional[str] = None):
    """Retrieve applications submitted by a user (email/phone)."""
    if not email and not phone:
        raise HTTPException(status_code=400, detail="Email or phone is required")

    try:
        applications = await db_manager.get_applications(email=email, phone=phone)
        return JobApplicationListResponse(
            success=True,
            data=applications,
            count=len(applications)
        )
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching applications: {str(e)}")


@router.get("", response_model=JobListResponse)
async def list_jobs(
    search: Optional[str] = None,
    job_type: Optional[str] = None,
    qualification: Optional[str] = None,
    district: Optional[str] = None,
    experience: Optional[str] = None,
    min_salary: Optional[float] = None,
    max_salary: Optional[float] = None,
    taluk: Optional[str] = None,
    organization: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    sort: str = Query("recent", regex="^(recent|deadline|salary_high|salary_low)$")
):
    """Primary list endpoint used by the Jobs UI."""
    try:
        jobs, total = await db_manager.list_jobs(
            search=search,
            job_type=job_type,
            qualification=qualification,
            district=district,
            experience=experience,
            min_salary=min_salary,
            max_salary=max_salary,
            taluk=taluk,
            organization=organization,
            page=page,
            limit=limit,
            sort=sort
        )
        total_pages = max(1, math.ceil(total / limit)) if total else 1
        pagination = PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=total_pages
        )
        return JobListResponse(success=True, data=jobs, pagination=pagination)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing jobs: {str(e)}")


@router.get("/{job_id}", response_model=JobDetailResponse)
async def get_job(job_id: int):
    """Fetch full job details for Job Details page."""
    job = await db_manager.get_job_detail(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobDetailResponse(success=True, data=job)


@router.post("", response_model=JobMutationResponse)
async def create_job(request: JobCreateRequest):
    """Admin endpoint to create a new job posting."""
    try:
        job_id = await db_manager.create_job(request.model_dump(exclude_none=True))
        return JobMutationResponse(
            success=True,
            job_id=job_id,
            message="Job created successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating job: {str(e)}")


@router.put("/{job_id}", response_model=JobMutationResponse)
async def update_job(job_id: int, request: JobUpdateRequest):
    """Admin endpoint to update an existing job posting."""
    try:
        updated_id = await db_manager.update_job(job_id, request.model_dump(exclude_none=True))
        if not updated_id:
            raise HTTPException(status_code=404, detail="Job not found")
        return JobMutationResponse(
            success=True,
            job_id=updated_id,
            message="Job updated successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating job: {str(e)}")


@router.delete("/{job_id}", response_model=JobMutationResponse)
async def delete_job(job_id: int):
    """Soft delete (deactivate) a job posting."""
    try:
        deleted_id = await db_manager.deactivate_job(job_id)
        if not deleted_id:
            raise HTTPException(status_code=404, detail="Job not found")
        return JobMutationResponse(
            success=True,
            job_id=deleted_id,
            message="Job deactivated successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting job: {str(e)}")


@router.post("/{job_id}/apply", response_model=JobApplicationResponse)
async def apply_to_job(job_id: int, request: JobApplicationRequest):
    """Create an application entry used by Jobs UI."""
    try:
        application_id = await db_manager.apply_for_job(
            job_id=job_id,
            applicant_name=request.applicant_name,
            email=request.email,
            phone=request.phone,
            resume_url=request.resume_url,
            cover_letter=request.cover_letter,
            metadata=request.metadata
        )
        return JobApplicationResponse(
            success=True,
            application_id=application_id,
            job_id=job_id,
            message="Application submitted successfully"
        )
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting application: {str(e)}")

