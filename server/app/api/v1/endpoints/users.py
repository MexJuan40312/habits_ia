# Endpoints para usuarios

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models.user import User as DBUser
from app.ml.schemas import UserCreate, User as UserSchema, Habit as HabitSchema, UserLogin
from app.core.security import get_password_hash
from app.core.security import create_access_token, verify_password
from app.core.config import settings
from datetime import timedelta
from app.api.v1.deps import get_current_user


router = APIRouter()

@router.post("/users/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    db_user = DBUser(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ENDPOINT DE AUTENTICACIÓN
@router.post("/login") # La ruta se ajusta a "/login"
def login_for_access_token(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "email": user.email}

# NUEVO ENDPOINT PARA OBTENER EL USUARIO ACTUAL (útil para validar tokens)
@router.get("/me/", response_model=UserSchema)
def read_current_user(current_user: DBUser = Depends(get_current_user)):
    return current_user

# ENDPOINT para obtener los hábitos de un usuario
@router.get("/{user_id}/habits/", response_model=list[HabitSchema])
def read_user_habits(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's habits")
    return current_user.habits