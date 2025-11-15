from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Dict
from datetime import datetime
from app.core.database import get_db
from app.models.review import Review
from app.models.movie import Movie
from app.models.genre import Genre

router = APIRouter()

@router.get("/stats")
async def get_review_stats(db: Session = Depends(get_db)):
    """
    Get statistics about reviews
    """
    total_reviews = db.query(Review).count()
    
    if total_reviews == 0:
        return {
            "total_reviews": 0,
            "average_rating": 0,
            "reviews_by_year": [],
            "reviews_by_genre": [],
            "highest_rated": None
        }
    
    avg_rating = db.query(func.avg(Review.arty_rating)).scalar()
    
    # Reviews by year
    reviews_by_year = db.query(
        Movie.year,
        func.count(Review.id).label('count')
    ).join(Review).group_by(Movie.year).order_by(Movie.year).all()
    
    # Reviews by genre
    reviews_by_genre = db.query(
        Genre.name,
        func.count(Review.id).label('count')
    ).join(Genre.reviews).group_by(Genre.name).order_by(func.count(Review.id).desc()).all()
    
    # Highest rated movie
    highest_rated = db.query(Review).join(Movie).order_by(Review.arty_rating.desc()).first()
    
    return {
        "total_reviews": total_reviews,
        "average_rating": round(float(avg_rating), 1) if avg_rating else 0,
        "reviews_by_year": [{"year": year, "count": count} for year, count in reviews_by_year if year],
        "reviews_by_genre": [{"genre": name, "count": count} for name, count in reviews_by_genre],
        "highest_rated": {
            "title": highest_rated.movie.title,
            "rating": highest_rated.arty_rating
        } if highest_rated else None
    }

@router.get("/years")
async def get_available_years(db: Session = Depends(get_db)) -> List[int]:
    """
    Get all unique years that have reviews
    """
    years = db.query(Movie.year).join(Review).distinct().order_by(Movie.year.desc()).all()
    return [year[0] for year in years if year[0] is not None]

@router.get("/months")
async def get_available_months(db: Session = Depends(get_db)) -> List[str]:
    """
    Get all unique months that have reviews (format: YYYY-MM)
    """
    dates = db.query(Review.watched_date).order_by(Review.watched_date.desc()).all()
    
    months = set()
    for date_tuple in dates:
        date_obj = date_tuple[0]
        months.add(f"{date_obj.year}-{date_obj.month:02d}")
    
    return sorted(list(months), reverse=True)

