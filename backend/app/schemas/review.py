from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from app.schemas.movie import MovieInDB
from app.schemas.genre import GenreResponse

class ReviewBase(BaseModel):
    """Base review schema"""
    review_text: str = Field(..., min_length=10)
    arty_rating: float = Field(..., ge=-1000, le=1000000, description="Rating out of 10 (can be extreme!)")
    watched_date: date

class ReviewCreate(BaseModel):
    """Schema for creating a review"""
    movie_id: int
    review_text: str = Field(..., min_length=10)
    arty_rating: float = Field(..., ge=-1000, le=1000000, description="Rating out of 10 (can be extreme!)")
    watched_date: date
    genre_ids: List[int] = []

class ReviewUpdate(BaseModel):
    """Schema for updating a review"""
    review_text: Optional[str] = Field(None, min_length=10)
    arty_rating: Optional[float] = Field(None, ge=-1000, le=1000000, description="Rating out of 10 (can be extreme!)")
    watched_date: Optional[date] = None
    genre_ids: Optional[List[int]] = None

class ReviewResponse(ReviewBase):
    """Review response schema"""
    id: int
    movie_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ReviewWithMovie(ReviewResponse):
    """Review with movie details"""
    movie: MovieInDB
    genres: List[GenreResponse] = []
    
    class Config:
        from_attributes = True

class ReviewListItem(BaseModel):
    """Compact review item for lists"""
    id: int
    movie_title: str
    movie_year: Optional[int]
    poster_url: Optional[str]
    arty_rating: float
    watched_date: date
    review_preview: str  # First 150 chars
    genres: List[str] = []
    rank: Optional[int] = None  # Rank when sorted by rating

