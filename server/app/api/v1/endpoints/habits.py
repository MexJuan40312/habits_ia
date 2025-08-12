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
async def create_habit_for_user(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    db_habit = DBHabit(**habit.model_dump(), owner_id=current_user.id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)

    recommendations = get_habit_recommendations(db_habit.title, db_habit.description)

    response_data = {
        "id": db_habit.id,
        "title": db_habit.title,
        "description": db_habit.description,
        "created_at": db_habit.created_at,
        "owner_id": db_habit.owner_id,
        "recommendations": recommendations,
    }

    return response_data

@router.get("/", response_model=List[HabitWithRecommendations])
def read_all_habits(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    habits = db.query(DBHabit).filter(DBHabit.owner_id == current_user.id).all()

    habits_with_recs = []
    for habit in habits:
        recommendations = get_habit_recommendations(habit.title, habit.description)
        habits_with_recs.append(
            HabitWithRecommendations(
                id=habit.id,
                title=habit.title,
                description=habit.description,
                created_at=habit.created_at,
                owner_id=habit.owner_id,
                recommendations=recommendations
            )
        )
    return habits_with_recs

@router.get("/{habit_id}/", response_model=HabitWithRecommendations)
def read_habit_by_id(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    habit = db.query(DBHabit).filter(DBHabit.id == habit_id, DBHabit.owner_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    recommendations = get_habit_recommendations(habit.title, habit.description)
    return HabitWithRecommendations(
        id=habit.id,
        title=habit.title,
        description=habit.description,
        created_at=habit.created_at,
        owner_id=habit.owner_id,
        recommendations=recommendations
    )

@router.delete("/{habit_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    habit_to_delete = db.query(DBHabit).filter(DBHabit.id == habit_id, DBHabit.owner_id == current_user.id).first()

    if not habit_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    db.delete(habit_to_delete)
    db.commit()

    return