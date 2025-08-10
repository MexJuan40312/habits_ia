# Endpoints para usuarios

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models.user import User as DBUser
from app.ml.schemas import UserCreate, User as UserSchema, Habit as HabitSchema, UserLogin

router = APIRouter()

@router.post("/users/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Aquí se debería hashear la contraseña
    fake_hashed_password = user.password + "not_really_hashed"
    
    db_user = DBUser(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users/{user_id}/habits/", response_model=list[HabitSchema])
def read_user_habits(user_id: int, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user.habits

# ENDPOINT DE AUTENTICACIÓN ACTUALIZADO
@router.post("/users/login")
def login_for_access_token(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.email == user_data.email).first()
    if not user or user.hashed_password != user_data.password + "not_really_hashed":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Aquí se debería generar un token JWT real.
    return {"message": "Login successful", "user_id": user.id, "email": user.email}