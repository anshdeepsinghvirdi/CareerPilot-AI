from fastapi import APIRouter
import random
from ..email_services import send_otp_email
from fastapi import Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud

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

@router.post("/reset-password")
def reset_password(
    email: str,
    new_password: str,
    db: Session = Depends(get_db)
):

    user = crud.get_user_by_email(db, email)

    if not user:
        return {"message": "User not found"}

    crud.update_password(db, user, new_password)
    otp_store.pop(email, None)

    return {"message": "Password updated successfully"}