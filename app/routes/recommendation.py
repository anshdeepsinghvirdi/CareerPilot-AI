from fastapi import APIRouter, Depends 
from sqlalchemy.orm import Session

from ..database import get_db
from ..jwt_handler import get_current_user
from .. import crud, models

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"]
)

@router.get("/")
def get_recommendation(
    db:Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_recommendations(
        db=db,
        user=current_user
    )