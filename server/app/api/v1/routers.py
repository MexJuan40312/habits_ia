# app/api/v1/routers.py

from fastapi import APIRouter

# Importamos los enrutadores individuales de nuestros endpoints.
from .endpoints import users, habits

# Creamos un enrutador principal para consolidar todas las rutas.
router = APIRouter()

# Incluimos los enrutadores de usuarios y hábitos, con sus prefijos correspondientes.
router.include_router(users.router, tags=["users"], prefix="/users")
router.include_router(habits.router, tags=["habits"], prefix="/habits")