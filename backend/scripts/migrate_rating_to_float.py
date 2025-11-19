"""
Migration script to convert arty_rating from INTEGER to FLOAT
Run with: python -m scripts.migrate_rating_to_float
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import text
from app.core.database import SessionLocal, engine

def migrate_rating_to_float():
    """Convert arty_rating column from INTEGER to FLOAT"""
    db = SessionLocal()
    
    try:
        print("🔧 Starting migration: arty_rating INTEGER → FLOAT\n")
        
        # Check current data type
        result = db.execute(text("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'reviews' 
            AND column_name = 'arty_rating'
        """))
        current_type = result.fetchone()
        
        if current_type:
            print(f"Current data type: {current_type[0]}")
            
            if current_type[0] == 'integer':
                print("Converting column to FLOAT...")
                
                # Alter column type
                db.execute(text("""
                    ALTER TABLE reviews 
                    ALTER COLUMN arty_rating TYPE FLOAT 
                    USING arty_rating::FLOAT
                """))
                
                db.commit()
                print("✓ Column successfully converted to FLOAT!")
            else:
                print(f"✓ Column is already {current_type[0]}, no migration needed.")
        else:
            print("✗ Could not find arty_rating column")
            
        # Verify the change
        result = db.execute(text("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'reviews' 
            AND column_name = 'arty_rating'
        """))
        new_type = result.fetchone()
        print(f"\nFinal data type: {new_type[0]}")
        
        # Show sample data
        result = db.execute(text("""
            SELECT id, arty_rating 
            FROM reviews 
            LIMIT 5
        """))
        ratings = result.fetchall()
        
        if ratings:
            print("\nSample ratings:")
            for review_id, rating in ratings:
                print(f"  Review #{review_id}: {rating}/10")
        
        print("\n✓ Migration complete!")
        
    except Exception as e:
        print(f"✗ Error during migration: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🎄 Pien's Kerstfilm Bonanza - Database Migration\n")
    migrate_rating_to_float()

