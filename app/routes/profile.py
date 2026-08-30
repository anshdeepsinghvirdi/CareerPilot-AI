from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas, models
from ..database import get_db
from ..jwt_handler import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("", response_model=schemas.UserResponse)
def get_profile(
    current_user = Depends(get_current_user)
):
    return current_user

@router.put("/update", response_model=schemas.UserResponse)
def update_profile(
    profile: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()

    user.college = profile.college
    user.branch = profile.branch
    user.graduation_year = profile.graduation_year
    user.skills = profile.skills
    user.career_goal = profile.career_goal

    db.commit()
    db.refresh(user)

    return user