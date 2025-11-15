from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.core.database import get_db
from app.models.movie import Movie
from app.models.review import Review
from app.schemas.movie import MovieInDB
from app.schemas.review import ReviewWithMovie, ReviewListItem

router = APIRouter()

@router.get("/", response_model=List[ReviewListItem])
async def get_movies(
    year: Optional[int] = Query(None, description="Filter by year"),
    rating: Optional[int] = Query(None, ge=1, le=10, description="Minimum Arty rating"),
    genre: Optional[str] = Query(None, description="Filter by genre slug"),
    watched_month: Optional[str] = Query(None, description="Filter by watched month (YYYY-MM)"),
    search: Optional[str] = Query(None, description="Search by title"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get all movies with reviews (with filters)
    Returns list of movies with review previews
    """
    query = db.query(Review).join(Movie)
    
    # Apply filters
    if year:
        query = query.filter(Movie.year == year)
    
    if rating:
        query = query.filter(Review.arty_rating >= rating)
    
    if genre:
        from app.models.genre import Genre
        query = query.join(Review.genres).filter(Genre.slug == genre)
    
    if watched_month:
        # Parse YYYY-MM format
        try:
            year_val, month_val = map(int, watched_month.split('-'))
            from sqlalchemy import extract
            query = query.filter(
                extract('year', Review.watched_date) == year_val,
                extract('month', Review.watched_date) == month_val
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
    
    if search:
        query = query.filter(
            or_(
                Movie.title.ilike(f"%{search}%"),
                Movie.original_title.ilike(f"%{search}%")
            )
        )
    
    # Get results
    reviews = query.order_by(Review.watched_date.desc()).offset(skip).limit(limit).all()
    
    # Format response
    result = []
    for review in reviews:
        result.append(ReviewListItem(
            id=review.id,
            movie_title=review.movie.title,
            movie_year=review.movie.year,
            poster_url=review.movie.poster_url,
            arty_rating=review.arty_rating,
            watched_date=review.watched_date,
            review_preview=review.review_text[:150] + "..." if len(review.review_text) > 150 else review.review_text,
            genres=[g.name for g in review.genres]
        ))
    
    return result

@router.get("/{movie_id}", response_model=ReviewWithMovie)
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Get a single movie with full review
    """
    review = db.query(Review).filter(Review.movie_id == movie_id).first()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return review

