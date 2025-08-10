# Agrupa los endpoints por versión
from fastapi import APIRouter
from .endpoints import users, habits

router = APIRouter()
router.include_router(users.router, tags=["users"])
router.include_router(habits.router, tags=["habits"])