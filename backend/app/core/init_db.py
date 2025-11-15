from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

def init_db() -> None:
    """Initialize database with admin user"""
    db: Session = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        
        if not admin_user:
            logger.info(f"Creating admin user: {settings.ADMIN_EMAIL}")
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info("✓ Admin user created successfully!")
        else:
            logger.info("✓ Admin user already exists")
            
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

