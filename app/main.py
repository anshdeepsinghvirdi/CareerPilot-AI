from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base

from .routes.auth import router as auth_router
from .routes.resume import router as resume_router
from .routes import profile
from .routes import recommendation
from .routes import roadmap
from .routes.interview import router as interview_router
from .routes import dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(profile.router)
app.include_router(recommendation.router)
app.include_router(roadmap.router)
app.include_router(interview_router)
app.include_router(dashboard.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to CareerPilot AI"
    }