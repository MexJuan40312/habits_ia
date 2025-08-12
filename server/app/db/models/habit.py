# Modelo de datos para hábitos (SQLAlchemy)
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ...core.database import Base
from datetime import datetime

class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)  # <--- Este campo es el que faltaba.
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="habits")