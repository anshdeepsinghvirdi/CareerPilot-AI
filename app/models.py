from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    college = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    skills = Column(String, nullable=True)
    career_goal = Column(String, nullable=True)

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    content = Column(Text)
    analysis = Column(Text)

    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")

class RoadmapProgress(Base):
    __tablename__ = "roadmap_progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    roadmap_id = Column(
        Integer,
        ForeignKey("roadmaps.id"),
        nullable=False
    )

    stage_index = Column(
        Integer,
        nullable=False
    )

    status = Column(
        String,
        default="upcoming"
    )

    user = relationship("User")
    roadmap_record = relationship("Roadmap")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    career_goal = Column(String, nullable=True)

    roadmap = Column(
        Text,
        nullable=False
    )

    user = relationship("User")