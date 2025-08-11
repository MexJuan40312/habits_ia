# server/app/api/v1/endpoints/habits.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models.habit import Habit as DBHabit
from app.api.v1.deps import get_current_user
from app.db.models.user import User as DBUser
from app.ml.schemas import HabitCreate, HabitWithRecommendations
from app.ml.recommendations import get_habit_recommendations

router = APIRouter()

@router.post("/", response_model=HabitWithRecommendations)
def create_habit_for_user(
    habit: HabitCreate, 
    db: Session = Depends(get_db), 
    current_user: DBUser = Depends(get_current_user)
):
    db_habit = DBHabit(**habit.model_dump(), owner_id=current_user.id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    
    recommendations = get_habit_recommendations(db_habit.title, db_habit.description)
    
    response_data = {**db_habit.__dict__, "recommendations": recommendations}
    
    return HabitWithRecommendations(**response_data)