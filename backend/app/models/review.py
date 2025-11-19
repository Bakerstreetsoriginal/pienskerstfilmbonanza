from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# Association table for many-to-many relationship between reviews and genres
review_genres = Table(
    'review_genres',
    Base.metadata,
    Column('review_id', Integer, ForeignKey('reviews.id', ondelete='CASCADE'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id', ondelete='CASCADE'), primary_key=True)
)

class Review(Base):
    """Review model - Pien's kerstfilm reviews"""
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey('movies.id', ondelete='CASCADE'), nullable=False, unique=True)
    
    # Review content
    review_text = Column(Text, nullable=False)
    arty_rating = Column(Float, nullable=False)  # X/10 rating (can be extreme: -1000 to 1000000)
    watched_date = Column(Date, nullable=False, index=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    movie = relationship("Movie", back_populates="review")
    genres = relationship("Genre", secondary=review_genres, back_populates="reviews")

