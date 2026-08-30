from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, jwt_handler
from ..database import  get_db
from ..models import User
from ..ai import generate_interview_question, evaluate_answer

router = APIRouter(
    prefix="/interview",
    tags=["AI Interview"]
)

@router.post("/start")
def start_interview(
    request: schemas.InterviewRequest,
    current_user: User = Depends(jwt_handler.get_current_user)
):

    question =  generate_interview_question(request.role)

    return { 
        "role": request.role,
        "question": question
    }

@router.post("/answer")
def answer_interview(
    request: schemas.InterviewAnswer,
    current_user=Depends(jwt_handler.get_current_user)
):
    try:
        evaluation = evaluate_answer(
            request.role,
            request.question,
            request.answer
        )

        next_question = generate_interview_question(
            request.role
        )

        return {
            "evaluation": evaluation,
            "next_question": next_question
        }

    except Exception as e:
        print("Interview answer error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to evaluate answer and generate next question."
        )