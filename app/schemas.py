from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    college: str
    branch: str
    graduation_year: int
    skills: str
    career_goal: str

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    college: str | None = None 
    branch: str | None = None 
    graduation_year: int | None = None 
    skills:  str | None = None 
    career_goal: str | None = None 

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    college: str
    branch: str
    graduation_year: int
    skills: str
    career_goal: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    college: str | None = None
    branch: str | None = None
    graduation_year: int | None = None
    skills: str | None = None
    career_goal: str | None = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    college: str
    branch: str
    graduation_year: int
    skills: str
    career_goal: str

class UserUpdate(BaseModel):
    name: str | None = None
    college: str | None = None
    branch: str | None = None
    graduation_year: int | None = None
    skills: str | None = None
    career_goal: str | None = None 

class ResumeResponse(BaseModel):
    id: int
    filename: str
    analysis: str

    class Config:
        from_attributes = True

class InterviewRequest(BaseModel):
    role: str

class InterviewAnswer(BaseModel):
    role: str
    question: str
    answer: str

class ResumeHistory(BaseModel):
    id: int
    filename: str
    analysis: str

    class Config:
        from_attributes = True

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str