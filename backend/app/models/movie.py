from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Movie(Base):
    """Movie model"""
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(Integer, unique=True, index=True, nullable=True)
    title = Column(String, nullable=False, index=True)
    original_title = Column(String)
    year = Column(Integer, index=True)
    plot = Column(Text)
    poster_url = Column(String)
    backdrop_url = Column(String)
    director = Column(String)
    cast = Column(Text)  # JSON string of cast members
    runtime = Column(Integer)  # in minutes
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    review = relationship("Review", back_populates="movie", uselist=False, cascade="all, delete-orphan")

