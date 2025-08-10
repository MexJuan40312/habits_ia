# server/app/api/v1/endpoints/habits.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models.habit import Habit as DBHabit
from app.ml.schemas import HabitCreate, Habit as HabitSchema
from app.api.v1.deps import get_current_user
from app.db.models.user import User as DBUser

router = APIRouter()

@router.post("/habits/", response_model=HabitSchema)
def create_habit_for_user(
    habit: HabitCreate, 
    db: Session = Depends(get_db), 
    current_user: DBUser = Depends(get_current_user) # Obtiene el usuario autenticado
):
    # El user_id se obtiene directamente del usuario autenticado, no de la URL
    db_habit = DBHabit(**habit.dict(), owner_id=current_user.id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit