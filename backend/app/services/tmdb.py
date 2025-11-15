import httpx
from typing import List, Dict, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class TMDBService:
    """Service for interacting with The Movie Database (TMDB) API"""
    
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        self.image_base_url = settings.TMDB_IMAGE_BASE_URL
    
    async def search_christmas_movies(self, query: str) -> Dict:
        """
        Search for Christmas movies on TMDB
        """
        if not self.api_key:
            logger.warning("TMDB API key not configured")
            return {"results": [], "total_results": 0}
        
        async with httpx.AsyncClient() as client:
            try:
                # Search with Christmas context
                search_query = f"{query} christmas"
                
                response = await client.get(
                    f"{self.base_url}/search/movie",
                    params={
                        "api_key": self.api_key,
                        "query": search_query,
                        "language": "en-US",
                        "page": 1
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Format results
                results = []
                for movie in data.get("results", [])[:10]:  # Limit to 10 results
                    release_date = movie.get("release_date", "")
                    year = int(release_date[:4]) if release_date else None
                    
                    poster_path = movie.get("poster_path")
                    poster_url = f"{self.image_base_url}{poster_path}" if poster_path else None
                    
                    results.append({
                        "tmdb_id": movie["id"],
                        "title": movie.get("title", ""),
                        "original_title": movie.get("original_title", ""),
                        "year": year,
                        "poster_url": poster_url,
                        "overview": movie.get("overview", "")
                    })
                
                return {
                    "results": results,
                    "total_results": len(results)
                }
                
            except httpx.HTTPError as e:
                logger.error(f"TMDB API error: {e}")
                return {"results": [], "total_results": 0}
    
    async def get_movie_details(self, tmdb_id: int) -> Optional[Dict]:
        """
        Get detailed movie information from TMDB
        """
        if not self.api_key:
            logger.warning("TMDB API key not configured")
            return None
        
        async with httpx.AsyncClient() as client:
            try:
                # Get movie details
                response = await client.get(
                    f"{self.base_url}/movie/{tmdb_id}",
                    params={
                        "api_key": self.api_key,
                        "language": "en-US",
                        "append_to_response": "credits"
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Get credits (cast and crew)
                credits = data.get("credits", {})
                
                # Get director
                director = None
                for crew_member in credits.get("crew", []):
                    if crew_member.get("job") == "Director":
                        director = crew_member.get("name")
                        break
                
                # Get main cast (first 5)
                cast_list = []
                for cast_member in credits.get("cast", [])[:5]:
                    cast_list.append(cast_member.get("name"))
                cast_str = ", ".join(cast_list) if cast_list else None
                
                # Format release date
                release_date = data.get("release_date", "")
                year = int(release_date[:4]) if release_date else None
                
                # Get poster and backdrop
                poster_path = data.get("poster_path")
                poster_url = f"{self.image_base_url}{poster_path}" if poster_path else None
                
                backdrop_path = data.get("backdrop_path")
                backdrop_url = f"{self.image_base_url}{backdrop_path}" if backdrop_path else None
                
                return {
                    "tmdb_id": tmdb_id,
                    "title": data.get("title"),
                    "original_title": data.get("original_title"),
                    "year": year,
                    "overview": data.get("overview"),
                    "poster_url": poster_url,
                    "backdrop_url": backdrop_url,
                    "runtime": data.get("runtime"),
                    "director": director,
                    "cast": cast_str
                }
                
            except httpx.HTTPError as e:
                logger.error(f"TMDB API error getting movie {tmdb_id}: {e}")
                return None

