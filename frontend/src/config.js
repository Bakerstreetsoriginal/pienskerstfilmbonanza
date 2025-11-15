// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  
  // Movies & Reviews
  MOVIES: '/api/movies',
  REVIEWS_STATS: '/api/reviews/stats',
  REVIEWS_YEARS: '/api/reviews/years',
  REVIEWS_MONTHS: '/api/reviews/months',
  
  // Admin
  ADMIN_REVIEWS: '/api/admin/reviews',
  ADMIN_GENRES: '/api/admin/genres',
  ADMIN_SEARCH_TMDB: '/api/admin/search-tmdb',
  ADMIN_TMDB_DETAILS: '/api/admin/tmdb',
  ADMIN_MOVIES: '/api/admin/movies',
  ADMIN_MOVIE_FROM_TMDB: '/api/admin/movies/from-tmdb',
}

