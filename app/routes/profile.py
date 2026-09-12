from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pathlib import Path

from .. import schemas, models
from ..database import get_db
from ..jwt_handler import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("", response_model=schemas.UserResponse)
def get_profile(
    current_user=Depends(get_current_user)
):
    return current_user


@router.put("/update", response_model=schemas.UserResponse)
def update_profile(
    profile: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.id == current_user.id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.college = profile.college
    user.branch = profile.branch
    user.graduation_year = profile.graduation_year
    user.skills = profile.skills
    user.career_goal = profile.career_goal

    db.commit()
    db.refresh(user)

    return user


@router.delete("/delete-account")
def delete_account(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.id == current_user.id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    try:
        # -------------------------------------------------
        # 1. Find user's resumes
        # -------------------------------------------------

        resumes = db.query(models.Resume).filter(
            models.Resume.user_id == user.id
        ).all()

        # -------------------------------------------------
        # 2. Delete uploaded resume files
        # -------------------------------------------------

        upload_folder = Path(__file__).resolve().parent.parent / "uploads"

        for resume in resumes:

            if resume.filename:

                file_path = upload_folder / resume.filename

                try:
                    if file_path.exists():
                        file_path.unlink()
                except Exception as file_error:
                    print(
                        f"Could not delete file {file_path}: "
                        f"{file_error}"
                    )

        # -------------------------------------------------
        # 3. Delete roadmap progress
        # -------------------------------------------------

        db.query(models.RoadmapProgress).filter(
            models.RoadmapProgress.user_id == user.id
        ).delete(
            synchronize_session=False
        )

        # -------------------------------------------------
        # 4. Delete roadmaps
        # -------------------------------------------------

        db.query(models.Roadmap).filter(
            models.Roadmap.user_id == user.id
        ).delete(
            synchronize_session=False
        )

        # -------------------------------------------------
        # 5. Delete resumes
        # -------------------------------------------------

        db.query(models.Resume).filter(
            models.Resume.user_id == user.id
        ).delete(
            synchronize_session=False
        )

        # -------------------------------------------------
        # 6. Delete user account
        # -------------------------------------------------

        db.delete(user)

        # -------------------------------------------------
        # 7. Save changes
        # -------------------------------------------------

        db.commit()

        return {
            "message": "Account and associated data deleted successfully"
        }

    except Exception as error:

        db.rollback()

        print(
            "Account deletion error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete account"
        )