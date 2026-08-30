from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 

from ..database import get_db
from ..jwt_handler import get_current_user
from .. import crud, models

router = APIRouter(
    prefix="/roadmap",
    tags=["Career Roadmap"]
)

@router.get("/")
def roadmap(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.generate_user_roadmap(current_user, db)

@router.post("/complete-stage")
def complete_stage(
    stage_index: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.complete_roadmap_stage(
        db,
        current_user,
        stage_index
    )