from fastapi import APIRouter
import random
from ..email_services import send_otp_email
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud
from pydantic import BaseModel
from . import jwt_handler

router = APIRouter(
    prefix="/forgot-password",
    tags=["Forgot Password"]
)

otp_store = {}

@router.post("/send-otp")
def send_otp(email: str):
    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp
    send_otp_email(email, otp)

    return {
        "message": "OTP sent successfully"
    }

@router.post("/verify-otp")
def verify_otp(email: str, otp:str):
    saved_otp = otp_store.get(email)

    if not saved_otp:
        return {"message": "OTP expired"}

    if saved_otp != otp:
        return {"message": "Invalid OTP"}

    return {"message": "OTP Verified"}


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    email = jwt_handler.verify_reset_token(request.token)

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link"
        )

    user = crud.get_user_by_email(db, email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    crud.update_password(
        db,
        user,
        request.new_password
    )

    return {
        "message": "Password updated successfully"
    }