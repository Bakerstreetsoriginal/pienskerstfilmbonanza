// API Configuration
// Note: VITE_API_URL should include /api prefix
// Development: http://localhost:8000/api
// Production: https://yourdomain.nl/api
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  ME: '/auth/me',
  
  // Movies & Reviews
  MOVIES: '/movies',
  REVIEWS_STATS: '/reviews/stats',
  REVIEWS_YEARS: '/reviews/years',
  REVIEWS_MONTHS: '/reviews/months',
  
  // Admin
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_GENRES: '/admin/genres',
  ADMIN_SEARCH_TMDB: '/admin/search-tmdb',
  ADMIN_TMDB_DETAILS: '/admin/tmdb',
  ADMIN_MOVIES: '/admin/movies',
  ADMIN_MOVIE_FROM_TMDB: '/admin/movies/from-tmdb',
}

