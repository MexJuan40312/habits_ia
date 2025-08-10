# app/api/v1/routers.py

from fastapi import APIRouter

# Importamos los enrutadores individuales de nuestros endpoints.
# Las importaciones son relativas al paquete 'routers'.
from .endpoints import users, habits

# Creamos un enrutador principal para consolidar todas las rutas.
router = APIRouter()

# Incluimos los enrutadores de usuarios y hábitos.
router.include_router(users.router, tags=["users"])
router.include_router(habits.router, tags=["habits"])
