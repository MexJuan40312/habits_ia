# Endpoints para hábitos
# server/app/api/v1/endpoints/habits.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models.user import User as DBUser
from app.db.models.habit import Habit as DBHabit
from app.ml.schemas import HabitCreate, Habit as HabitSchema

router = APIRouter()

@router.post("/habits/", response_model=HabitSchema)
def create_habit_for_user(habit: HabitCreate, user_id: int, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db_habit = DBHabit(**habit.dict(), owner_id=user_id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.get("/habits/", response_model=list[HabitSchema])
def read_habits(db: Session = Depends(get_db)):
    habits = db.query(DBHabit).all()
    return habits