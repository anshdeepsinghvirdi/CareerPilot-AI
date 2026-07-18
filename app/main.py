from fastapi import FastAPI 

from .database import engine
from .models import Base
from .routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)



@app.get("/")
def home():
    return {
        "message": "Welcome to CareerPilot AI"
    }