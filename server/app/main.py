# server/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import Base, engine
from .api.v1.routers import router
from .db.models import user, habit

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # C\u00f3digo que se ejecuta al iniciar la aplicaci\u00f3n
    print("Iniciando la aplicaci\u00f3n...")
    yield
    # C\u00f3digo que se ejecuta al cerrar la aplicaci\u00f3n
    print("Cerrando la aplicaci\u00f3n...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configuraci\u00f3n de CORS
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
