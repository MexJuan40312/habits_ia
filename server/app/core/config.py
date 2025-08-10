# Configuración de la aplicación y las variables de entorno
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Habit Analyzer API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    class Config:
        env_file = ".env"

settings = Settings()