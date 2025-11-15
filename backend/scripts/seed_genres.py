"""
Seed script to populate genres in the database
Run with: python -m scripts.seed_genres
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.genre import Genre

GENRES = [
    {"name": "Romantisch", "slug": "romantic", "description": "Kerstfilms met romantiek als hoofdthema"},
    {"name": "Familie", "slug": "family", "description": "Leuke kerstfilms voor het hele gezin"},
    {"name": "Komedie", "slug": "comedy", "description": "Grappige kerstfilms"},
    {"name": "Drama", "slug": "drama", "description": "Serieuze en emotionele kerstfilms"},
    {"name": "Hallmark", "slug": "hallmark", "description": "Klassieke Hallmark kerstfilms"},
    {"name": "Netflix Original", "slug": "netflix", "description": "Netflix originele kerstfilms"},
    {"name": "Classic", "slug": "classic", "description": "Klassieke tijdloze kerstfilms"},
    {"name": "Musical", "slug": "musical", "description": "Kerstfilms met muziek en zang"},
    {"name": "Animatie", "slug": "animation", "description": "Geanimeerde kerstfilms"},
    {"name": "Guilty Pleasure", "slug": "guilty-pleasure", "description": "Zo slecht dat het eigenlijk goed is"},
]

def seed_genres():
    db = SessionLocal()
    
    try:
        # Check existing genres
        existing_genres = db.query(Genre).all()
        existing_slugs = {g.slug for g in existing_genres}
        
        # Add missing genres
        added = 0
        for genre_data in GENRES:
            if genre_data["slug"] not in existing_slugs:
                genre = Genre(**genre_data)
                db.add(genre)
                added += 1
                print(f"✓ Added genre: {genre_data['name']}")
            else:
                print(f"- Genre already exists: {genre_data['name']}")
        
        db.commit()
        print(f"\n✓ Done! Added {added} new genres.")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🎄 Seeding genres...\n")
    seed_genres()

