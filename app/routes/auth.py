from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas, security
from ..database import get_db

router = APIRouter()

@router.post("/signup")
def signup(user: schemas.UserCreate, db:Session = Depends(get_db)):
    new_user = crud.create_user(db=db, user=user)

    return {
        "message": "User registered Successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)

    if not db_user:
        return {"message": "user not found"}
    
    if not security.verify_password(user.password, db_user.password):
        return {"message": "Incorrect Password"}
    
    return {
        "message": "Login successful",
        "user" : { 
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }