import os 
import shutil
import json

from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..jwt_handler import get_current_user
from ..pdf_generator import generate_pdf
from ..database import get_db
from .. import jwt_handler, models
from ..resume import extract_resume_text
from ..ai import analyze_resume

router = APIRouter(prefix="/resume", tags=["Resume"])

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(jwt_handler.get_current_user)
):
    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )
    
    if not file.filename.endswith((".pdf", ".docx")):
        return {"message": "only PDF and DOCX files are allowed"}
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_resume_text(file_path)

    analysis = analyze_resume(text)

    saved_resume = crud.create_resume(
        db=db,
        filename=file.filename,
        content=text,
        analysis=analysis,
        user_id=current_user.id
    )

    return{
        "message": "Resume Uploaded Successfully",
        "resume_id": saved_resume.id,
        "filename": saved_resume.filename,
        "analysis": saved_resume.analysis
    }

@router.get(
    "/history",
    response_model=list[schemas.ResumeHistory]
)
def resume_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(jwt_handler.get_current_user)
):
    return crud.get_resume_history(db, current_user.id)

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        jwt_handler.get_current_user
    )
):

    deleted = crud.delete_resume(
        db,
        resume_id,
        current_user.id
    )

    if not deleted:
        return {
            "message": "Resume not found"
        }

    return {
        "message": "Resume deleted successfully"
    }

@router.get("/latest")
def get_latest_resume(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        jwt_handler.get_current_user
    )
):
    resume = crud.get_latest_resume(
        db,
        current_user.id
    )

    if not resume:
        return {
            "resume_score": None,
            "message": "No resume found"
        }

    analysis = resume.analysis

    if isinstance(analysis, str):
        try:
            analysis = json.loads(analysis)
        except json.JSONDecodeError:
            return {
                "resume_score": None,
                "message": "Invalid resume analysis"
            }

    return {
        "resume_id": resume.id,
        "resume_score": analysis.get("overall_score"),
        "analysis": analysis
    }

@router.get("/dashboard")
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        jwt_handler.get_current_user
    )
):

    resume = crud.get_latest_resume(
        db,
        current_user.id
    )

    resume_score = None
    missing_skills = []
    strengths = []
    recommended_jobs = []
    learning_roadmap = []

    if resume:

        analysis = resume.analysis

        if isinstance(analysis, str):

            try:
                analysis = json.loads(analysis)

            except json.JSONDecodeError:
                analysis = {}

        if isinstance(analysis, dict):

            resume_score = analysis.get("overall_score")

            career_progress = analysis.get(
                "career_progress",
                0
            )

            missing_skills = analysis.get(
                "missing_skills",
                []
            )

            strengths = analysis.get(
                "strengths",
                []
            )

            recommended_jobs = analysis.get(
                "recommended_jobs",
                []
            )

            learning_roadmap = analysis.get(
                "learning_roadmap",
                []
            )

    career_goal = current_user.career_goal or "Not set"

    skills_text = current_user.skills or ""

    skills = [
        skill.strip()
        for skill in skills_text.split(",")
        if skill.strip()
    ]

    skills_count = len(skills)

    if learning_roadmap:

        current_focus = learning_roadmap[0]

    elif missing_skills:

        current_focus = missing_skills[0]

    else:

        current_focus = (
            "Continue building your skills"
        )

    if not isinstance(
        learning_roadmap,
        list
    ):

        learning_roadmap = []


    return {

        "name": current_user.name,

        "resume_score": resume_score,

        "career_goal": career_goal,

        "skills_count": skills_count,

        "career_progress": career_progress,

        "current_focus": current_focus,

        "missing_skills": missing_skills,

        "strengths": strengths,

        "recommended_jobs": recommended_jobs,

        "learning_roadmap": learning_roadmap
    }

@router.get("/download/{resume_id}")
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        jwt_handler.get_current_user
    )
):

    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()

    if not resume:
        return {
            "message": "Resume not found"
        }

    file_path = os.path.join(
        UPLOAD_FOLDER,
        resume.filename
    )

    if not os.path.exists(file_path):
        return {
            "message": "Resume file not found"
        }

    return FileResponse(
        path=file_path,
        filename=resume.filename,
        media_type="application/octet-stream"
    )


@router.get("/analysis/{resume_id}/download")
def download_analysis(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        jwt_handler.get_current_user
    )
):

    resume = (
        db.query(models.Resume)
        .filter(
            models.Resume.id == resume_id,
            models.Resume.user_id == current_user.id
        )
        .first()
    )

    if not resume:
        return {
            "message": "Resume not found"
        }

    analysis = resume.analysis

    # Convert JSON string to dictionary
    if isinstance(analysis, str):

        try:
            analysis = json.loads(analysis)

            # Handle double encoded JSON
            if isinstance(analysis, str):
                analysis = json.loads(analysis)

        except json.JSONDecodeError:
            return {
                "message": "Invalid resume analysis"
            }

    if not isinstance(analysis, dict):
        return {
            "message": "Invalid analysis format"
        }

    # Make sure resume_score exists
    if "resume_score" not in analysis:

        analysis["resume_score"] = analysis.get(
            "overall_score",
            0
        )

    # Create reports folder
    REPORT_FOLDER = os.path.join(
        BASE_DIR,
        "reports"
    )

    os.makedirs(
        REPORT_FOLDER,
        exist_ok=True
    )

    pdf_path = os.path.join(
        REPORT_FOLDER,
        f"CareerPilot_AI_Report_{resume.id}.pdf"
    )

    # IMPORTANT:
    # generate_pdf(analysis, filepath)
    generate_pdf(
        analysis,
        pdf_path
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="CareerPilot_AI_Resume_Analysis.pdf"
    )