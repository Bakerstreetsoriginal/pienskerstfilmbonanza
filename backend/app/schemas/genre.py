from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GenreBase(BaseModel):
    """Base genre schema"""
    name: str
    slug: str
    description: Optional[str] = None

class GenreCreate(GenreBase):
    """Schema for creating a genre"""
    pass

class GenreUpdate(BaseModel):
    """Schema for updating a genre"""
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None

class GenreResponse(GenreBase):
    """Genre response schema"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

