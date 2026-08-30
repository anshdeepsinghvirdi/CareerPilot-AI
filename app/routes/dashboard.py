import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..jwt_handler import get_current_user
from .. import models, crud

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    resumes = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.id.desc())
        .all()
    )

    analysis = None

    for resume in resumes:

        if not resume.analysis:
            continue

        try:
            parsed = json.loads(resume.analysis)

            if (
                isinstance(parsed, dict)
                and "overall_score" in parsed
                and "career_progress" in parsed
            ):
                analysis = parsed
                break

        except Exception:
            continue

    if analysis:
        resume_score = analysis.get("overall_score", 0)
        career_progress = analysis.get("career_progress", 0)
    else:
        resume_score = 0
        career_progress = 0

    return {
        "name": current_user.name,
        "career_goal": current_user.career_goal,
        "resume_score": resume_score,
        "career_progress": career_progress
    }