from fastapi import APIRouter, HTTPException
from datetime import datetime

from database import db_manager
from models import JobSearchRequest, JobSearchResponse


router = APIRouter(prefix="/api", tags=["analytics"])


@router.get("/jobs/stats")
async def get_job_statistics():
    """Get job portal statistics"""
    try:
        stats = await db_manager.get_job_statistics()
        return {
            "success": True,
            "data": stats,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")


@router.post("/jobs/search", response_model=JobSearchResponse)
async def search_jobs(request: JobSearchRequest):
    """Search jobs based on criteria"""
    try:
        jobs = await db_manager.search_jobs(
            job_type=request.job_type,
            qualification=request.qualification,
            district=request.district,
            experience=request.experience,
            limit=request.limit
        )

        return JobSearchResponse(
            success=True,
            data=jobs,
            count=len(jobs),
            message=f"Found {len(jobs)} jobs matching your criteria"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching jobs: {str(e)}")


@router.get("/analytics/trends")
async def trends(months: int = 6):
    try:
        data = await db_manager.get_jobs_trend_by_month(months)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trends: {str(e)}")


@router.get("/analytics/top-districts")
async def top_districts(limit: int = 5):
    try:
        data = await db_manager.get_top_districts(limit)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top districts: {str(e)}")


@router.get("/analytics/salary-distribution")
async def salary_distribution():
    try:
        data = await db_manager.get_salary_distribution()
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching salary distribution: {str(e)}")


@router.get("/analytics/top-organizations")
async def top_organizations(limit: int = 5):
    try:
        data = await db_manager.get_top_organizations(limit)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching organizations: {str(e)}")


