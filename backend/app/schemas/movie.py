from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MovieBase(BaseModel):
    """Base movie schema"""
    title: str
    original_title: Optional[str] = None
    year: Optional[int] = None
    plot: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    director: Optional[str] = None
    cast: Optional[str] = None
    runtime: Optional[int] = None

class MovieCreate(MovieBase):
    """Schema for creating a movie"""
    tmdb_id: Optional[int] = None

class MovieUpdate(MovieBase):
    """Schema for updating a movie"""
    title: Optional[str] = None

class MovieInDB(MovieBase):
    """Movie schema with database fields"""
    id: int
    tmdb_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class TMDBSearchResult(BaseModel):
    """TMDB search result schema"""
    tmdb_id: int
    title: str
    original_title: str
    year: Optional[int]
    poster_url: Optional[str]
    overview: Optional[str]

class TMDBSearchResponse(BaseModel):
    """TMDB search response schema"""
    results: List[TMDBSearchResult]
    total_results: int

