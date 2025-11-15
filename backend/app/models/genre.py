from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.models.review import review_genres

class Genre(Base):
    """Genre model - Kerstfilm subgenres"""
    __tablename__ = "genres"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    reviews = relationship("Review", secondary=review_genres, back_populates="genres")

