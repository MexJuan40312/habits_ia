# server/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import Base, engine
from .api.v1.routers import router
from .db.models import user, habit
from .ml.recommendations import load_spacy_model

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código que se ejecuta al iniciar la aplicación
    print("Iniciando la aplicación...")
    print("Cargando el modelo de SpaCy...")
    load_spacy_model()
    print("Modelo de SpaCy cargado correctamente.")
    yield
    # Código que se ejecuta al cerrar la aplicación
    print("Cerrando la aplicación...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configuración de CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Habit Analyzer API"}