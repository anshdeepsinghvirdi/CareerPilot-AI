from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from ..email_services import send_reset_email

from .. import crud, schemas, security, jwt_handler, models
from ..database import get_db

router = APIRouter()
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

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
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = crud.get_user_by_email(db, form_data.username)

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    print("Password length:", len(form_data.password))
    print("Password entered", form_data.password)

    if not security.verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )

    access_token = jwt_handler.create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: models.User = Depends(jwt_handler.get_current_user)
):
    return{
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@router.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(
    current_user: models.User = Depends(jwt_handler.get_current_user)
):
    return crud.get_profile(current_user)


@router.put("/profile", response_model=schemas.ProfileResponse)
def update_profile(
    profile: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(jwt_handler.get_current_user)
):
    return crud.update_profile(db, current_user, profile)

@router.post("/forgot-password")
def forgot_password(
    request: schemas.ForgotPassword,
    db: Session = Depends(get_db)
):
    print("FORGOT PASSWORD EMAIL ENTERED:", request.email)

    user = crud.get_user_by_email(db, request.email)

    print("USER FOUND:", user)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="No account found with this email"
        )

    try:
        token = jwt_handler.create_reset_token(user.email)

        reset_link = (
             f"https://career-pilot-8f3nyjqsu-anshdeepsinghvirdis-projects.vercel.app/reset-password/{token}"
        )

        send_reset_email(
            receiver_email=user.email,
            reset_link=reset_link
        )

        print("FORGOT PASSWORD EMAIL SENT TO:", user.email)

        return {
            "message": "Password reset email sent successfully"
        }

    except Exception as e:
        print("\n========== FORGOT PASSWORD ERROR ==========")
        print("Error type:", type(e).__name__)
        print("Error message:", repr(e))
        print("===========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to send password reset email: {str(e)}"
        )

@router.post("/reset-password")
def reset_password(
    request: schemas.ResetPassword,
    db: Session = Depends(get_db)
):

    email = jwt_handler.verify_reset_token(request.token)

    if not email:
        return {
            "message": "Invalid or expired token"
        }

    user = crud.get_user_by_email(db, email)

    if not user:
        return {
            "message": "User not found"
        }

    user.password = pwd_context.hash(request.new_password)

    db.commit()

    return {
        "message": "Password reset successfully"
    }

@router.post("/change-password")
def change_password(
    request: schemas.ChangePassword,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(jwt_handler.get_current_user)
):

    if not security.verify_password(
        request.current_password,
        current_user.password
    ):
        return {
            "message": "Current password is incorrect"
        }

    current_user.password = security.hash_password(
        request.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }