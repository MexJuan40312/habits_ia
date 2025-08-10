# Esquemas de datos para el ML
from pydantic import BaseModel
from datetime import datetime

# --- Esquemas para Usuarios ---
class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

# --- Esquemas para Hábitos ---
class HabitCreate(BaseModel):
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime

class Habit(BaseModel):
    id: int
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    owner_id: int

    class Config:
        orm_mode = True