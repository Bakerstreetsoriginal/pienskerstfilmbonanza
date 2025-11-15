from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, movies, reviews, admin
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Pien's Kerstfilm Bonanza API",
    description="API voor kerstfilm reviews met Arty ratings! 🎄❄️",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(movies.router, prefix="/api/movies", tags=["Movies"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.on_event("startup")
async def startup_event():
    """Create database tables and seed admin user"""
    logger.info("Starting up Kerstfilm Bonanza API...")
    
    # Create tables (in production, use Alembic migrations instead)
    Base.metadata.create_all(bind=engine)
    
    # Create admin user if not exists
    from app.core.init_db import init_db
    init_db()
    
    logger.info("✓ Startup complete!")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🎄 Welkom bij Pien's Kerstfilm Bonanza API! ❄️",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "kerstfilm-api"}

