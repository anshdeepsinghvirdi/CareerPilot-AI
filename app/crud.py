from sqlalchemy.orm import Session
from . import models, schemas, security
from .security import hash_password
from . import ai
import json


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=security.hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_profile(user):
    return user

def create_resume(
    db: Session,
    filename: str,
    content: str,
    analysis: str,
    user_id: int
):
    new_resume = models.Resume(
        filename=filename,
        content=content,
        analysis=json.dumps(analysis),
        user_id=user_id
    )

    db.add(new_resume)
    db.commit()
    print("Resume saved successfully!")
    db.refresh(new_resume)

    return new_resume

def update_profile(db, user_id, profile):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return None

    user.college = profile.college
    user.branch = profile.branch
    user.graduation_year= profile.graduation_year
    user.skills = profile.skills
    user.career_goal = profile.career_goal 

    db.commit()
    db.refresh(user)

    return user

def get_user_resumes(
        db: Session,
        user_id: int
):
    return (
        db. query(models.Resume)
        .filter(models.Resume.user_id == user_id)
        .all()
    )

def get_recommendations(db: Session, user):

    skills = user.skills or ""
    career_goal = user.career_goal or ""

    recommendations = ai.generate_job_recommendations(
        skills,
        career_goal
    )

    return {
        "user": user.name,
        "career_goal": career_goal,
        "recommended_jobs": recommendations
    }

def generate_user_roadmap(user, db):

    career_goal = user.career_goal

    # Do not generate or show a roadmap until the user sets a career goal
    if not career_goal or not career_goal.strip():

        return {
            "requires_career_goal": True,
            "message": "Please set your career goal first"
        }

    existing_roadmap = (
        db.query(models.Roadmap)
        .filter(
            models.Roadmap.user_id == user.id
        )
        .first()
    )

    if existing_roadmap:

        roadmap_data = json.loads(
            existing_roadmap.roadmap
        )

    else:

        skills = user.skills or ""

        roadmap = ai.generate_career_roadmap(
            skills,
            career_goal
        )

        if isinstance(roadmap, str):
            roadmap_data = json.loads(roadmap)
        else:
            roadmap_data = roadmap

        new_roadmap = models.Roadmap(
            user_id=user.id,
            career_goal=career_goal,
            roadmap=json.dumps(roadmap_data)
        )

        db.add(new_roadmap)
        db.commit()
        db.refresh(new_roadmap)

    stages = roadmap_data.get("stages", [])

    progress_records = (
        db.query(models.RoadmapProgress)
        .filter(
            models.RoadmapProgress.user_id == user.id
        )
        .all()
    )

    completed_stages = {
        record.stage_index
        for record in progress_records
        if record.status == "completed"
    }

    current_stage = None

    for index, stage in enumerate(stages):

        if index in completed_stages:

            stage["status"] = "completed"

        elif current_stage is None:

            stage["status"] = "current"
            current_stage = index

        else:

            stage["status"] = "upcoming"

    roadmap_data["stages"] = stages

    return {
        "user": user.name,
        "career_goal": career_goal,
        "roadmap": roadmap_data
    }

def get_resume_history(db: Session, user_id: int):
    return (
        db.query(models.Resume)
        .filter(models.Resume.user_id == user_id)
        .order_by(models.Resume.id.desc())
        .all()
    )

def delete_resume(db: Session, resume_id: int, user_id: int):
    resume = (
        db.query(models.Resume)
        .filter(
            models.Resume.id == resume_id,
            models.Resume.user_id == user_id
        )
        .first()
    )

    if not resume:
        return None

    db.delete(resume)
    db.commit()

    return True

def update_password(db, user, new_password):
    user.password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user

def get_latest_resume(db: Session, user_id:int):
    return (
        db.query(models.Resume)
        .filter(models.Resume.user_id == user_id)
        .order_by(models.Resume.id.desc())
        .first()
    )

def complete_roadmap_stage(db, user, stage_index):

    roadmap_record = (
        db.query(models.Roadmap)
        .filter(
            models.Roadmap.user_id == user.id
        )
        .order_by(models.Roadmap.id.desc())
        .first()
    )

    if not roadmap_record:
        return {
            "message": "No roadmap found for this user"
        }

    progress = (
        db.query(models.RoadmapProgress)
        .filter(
            models.RoadmapProgress.user_id == user.id,
            models.RoadmapProgress.roadmap_id == roadmap_record.id,
            models.RoadmapProgress.stage_index == stage_index
        )
        .first()
    )

    if progress:

        progress.status = "completed"

    else:

        progress = models.RoadmapProgress(
            user_id=user.id,
            roadmap_id=roadmap_record.id,
            stage_index=stage_index,
            status="completed"
        )

        db.add(progress)

    db.commit()

    return {
        "message": "Stage completed successfully",
        "stage_index": stage_index
    }