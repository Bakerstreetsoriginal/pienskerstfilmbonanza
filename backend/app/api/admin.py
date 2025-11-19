from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.audit_log import log_admin_action
from app.models.user import User
from app.models.movie import Movie
from app.models.review import Review
from app.models.genre import Genre
from app.schemas.movie import MovieCreate, MovieUpdate, MovieInDB, TMDBSearchResponse
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewWithMovie, ReviewResponse
from app.schemas.genre import GenreCreate, GenreResponse
from app.services.tmdb import TMDBService
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# TMDB Service
tmdb_service = TMDBService()

# ============================================================================
# GENRES
# ============================================================================

@router.get("/genres", response_model=List[GenreResponse])
async def get_genres(db: Session = Depends(get_db)):
    """Get all genres (public endpoint for form)"""
    genres = db.query(Genre).order_by(Genre.name).all()
    return genres

@router.post("/genres", response_model=GenreResponse)
@limiter.limit("10/minute")
async def create_genre(
    request: Request,
    genre: GenreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new genre"""
    # Check if genre already exists
    existing = db.query(Genre).filter(Genre.slug == genre.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Genre with this slug already exists")
    
    db_genre = Genre(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

# ============================================================================
# TMDB SEARCH
# ============================================================================

@router.get("/search-tmdb", response_model=TMDBSearchResponse)
@limiter.limit("30/minute")
async def search_tmdb(
    request: Request,
    query: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user)
):
    """Search for Christmas movies on TMDB"""
    results = await tmdb_service.search_christmas_movies(query)
    return results

@router.get("/tmdb/{tmdb_id}")
async def get_tmdb_movie(
    tmdb_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get full movie details from TMDB"""
    movie_data = await tmdb_service.get_movie_details(tmdb_id)
    if not movie_data:
        raise HTTPException(status_code=404, detail="Movie not found on TMDB")
    return movie_data

# ============================================================================
# REVIEWS
# ============================================================================

@router.get("/reviews", response_model=List[ReviewWithMovie])
async def get_all_reviews_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reviews for admin dashboard"""
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return reviews

@router.post("/reviews", response_model=ReviewResponse)
@limiter.limit("20/minute")
async def create_review(
    request: Request,
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new review"""
    # Check if movie exists
    movie = db.query(Movie).filter(Movie.id == review.movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Check if review already exists for this movie
    existing = db.query(Review).filter(Review.movie_id == review.movie_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already exists for this movie")
    
    # Create review
    review_data = review.dict(exclude={'genre_ids'})
    db_review = Review(**review_data)
    
    # Add genres
    if review.genre_ids:
        genres = db.query(Genre).filter(Genre.id.in_(review.genre_ids)).all()
        db_review.genres = genres
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Audit log
    client_ip = request.client.host if request.client else None
    log_admin_action(
        "CREATE_REVIEW", 
        current_user.email, 
        f"movie_id={movie.id} title={movie.title}",
        ip_address=client_ip
    )
    
    return db_review

@router.put("/reviews/{review_id}", response_model=ReviewResponse)
@limiter.limit("20/minute")
async def update_review(
    request: Request,
    review_id: int,
    review_update: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a review"""
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Update fields
    update_data = review_update.dict(exclude_unset=True, exclude={'genre_ids'})
    for field, value in update_data.items():
        setattr(db_review, field, value)
    
    # Update genres if provided
    if review_update.genre_ids is not None:
        genres = db.query(Genre).filter(Genre.id.in_(review_update.genre_ids)).all()
        db_review.genres = genres
    
    db.commit()
    db.refresh(db_review)
    
    # Audit log
    client_ip = request.client.host if request.client else None
    log_admin_action(
        "UPDATE_REVIEW", 
        current_user.email, 
        f"review_id={review_id}",
        ip_address=client_ip
    )
    
    return db_review

@router.delete("/reviews/{review_id}")
@limiter.limit("10/minute")
async def delete_review(
    request: Request,
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a review"""
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(db_review)
    db.commit()
    
    # Audit log
    client_ip = request.client.host if request.client else None
    log_admin_action(
        "DELETE_REVIEW", 
        current_user.email, 
        f"review_id={review_id}",
        ip_address=client_ip
    )
    
    return {"message": "Review deleted successfully"}

# ============================================================================
# MOVIES
# ============================================================================

@router.post("/movies", response_model=MovieInDB)
@limiter.limit("20/minute")
async def create_movie(
    request: Request,
    movie: MovieCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new movie"""
    # Check if movie with TMDB ID already exists
    if movie.tmdb_id:
        existing = db.query(Movie).filter(Movie.tmdb_id == movie.tmdb_id).first()
        if existing:
            return existing
    
    db_movie = Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    
    return db_movie

@router.post("/movies/from-tmdb/{tmdb_id}")
@limiter.limit("20/minute")
async def create_movie_from_tmdb(
    request: Request,
    tmdb_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a movie from TMDB data and return suggested genres"""
    # Check if already exists
    existing = db.query(Movie).filter(Movie.tmdb_id == tmdb_id).first()
    if existing:
        # Still get TMDB data for genre suggestions
        tmdb_data = await tmdb_service.get_movie_details(tmdb_id)
        suggested_genres = map_tmdb_genres_to_db(tmdb_data.get('genre_ids', []), db) if tmdb_data else []
        return {
            "movie": existing,
            "suggested_genre_ids": suggested_genres
        }
    
    # Get data from TMDB
    tmdb_data = await tmdb_service.get_movie_details(tmdb_id)
    if not tmdb_data:
        raise HTTPException(status_code=404, detail="Movie not found on TMDB")
    
    # Create movie
    db_movie = Movie(
        tmdb_id=tmdb_id,
        title=tmdb_data['title'],
        original_title=tmdb_data.get('original_title'),
        year=tmdb_data.get('year'),
        plot=tmdb_data.get('overview'),
        poster_url=tmdb_data.get('poster_url'),
        backdrop_url=tmdb_data.get('backdrop_url'),
        runtime=tmdb_data.get('runtime'),
        director=tmdb_data.get('director'),
        cast=tmdb_data.get('cast')
    )
    
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    
    # Map TMDB genres to our database genres
    suggested_genres = map_tmdb_genres_to_db(tmdb_data.get('genre_ids', []), db)
    
    return {
        "movie": db_movie,
        "suggested_genre_ids": suggested_genres
    }

def map_tmdb_genres_to_db(tmdb_genre_ids: List[int], db: Session) -> List[int]:
    """Map TMDB genre IDs to our database genre IDs"""
    # TMDB Genre ID mapping
    genre_mapping = {
        35: "comedy",        # Comedy → Komedie
        18: "drama",         # Drama → Drama
        10751: "family",     # Family → Familie
        10749: "romantic",   # Romance → Romantisch
        16: "animation",     # Animation → Animatie
        10402: "musical",    # Music → Musical
    }
    
    db_genre_ids = []
    for tmdb_id in tmdb_genre_ids:
        slug = genre_mapping.get(tmdb_id)
        if slug:
            genre = db.query(Genre).filter(Genre.slug == slug).first()
            if genre:
                db_genre_ids.append(genre.id)
    
    return db_genre_ids

@router.put("/movies/{movie_id}", response_model=MovieInDB)
@limiter.limit("20/minute")
async def update_movie(
    request: Request,
    movie_id: int,
    movie_update: MovieUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a movie"""
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    update_data = movie_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_movie, field, value)
    
    db.commit()
    db.refresh(db_movie)
    
    return db_movie

