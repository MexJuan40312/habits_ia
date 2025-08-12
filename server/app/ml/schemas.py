from typing import List, Optional
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
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

# --- Esquemas para Hábitos ---
# Esquema base para los h\u00e1bitos
class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None

# Esquema para crear un h\u00e1bito
class HabitCreate(HabitBase):
    pass

# Esquema para la respuesta de un h\u00e1bito, incluyendo el ID
class Habit(HabitBase):
    id: int
    owner_id: int
    created_at: datetime  # <--- Este campo es necesario y fue agregado aquí.

    class Config:
        from_attributes = True

# NUEVO: Esquema para la respuesta con recomendaciones
class HabitWithRecommendations(Habit):
    recommendations: List[str] = []