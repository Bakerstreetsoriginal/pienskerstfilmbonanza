import api from './api'
import { API_ENDPOINTS } from '../config'

export const movieService = {
  async getMovies(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.year) params.append('year', filters.year)
    if (filters.rating) params.append('rating', filters.rating)
    if (filters.genre) params.append('genre', filters.genre)
    if (filters.watched_month) params.append('watched_month', filters.watched_month)
    if (filters.search) params.append('search', filters.search)
    
    const response = await api.get(`${API_ENDPOINTS.MOVIES}?${params.toString()}`)
    return response.data
  },

  async getMovie(id) {
    const response = await api.get(`${API_ENDPOINTS.MOVIES}/${id}`)
    return response.data
  },

  async getStats() {
    const response = await api.get(API_ENDPOINTS.REVIEWS_STATS)
    return response.data
  },

  async getYears() {
    const response = await api.get(API_ENDPOINTS.REVIEWS_YEARS)
    return response.data
  },

  async getMonths() {
    const response = await api.get(API_ENDPOINTS.REVIEWS_MONTHS)
    return response.data
  },
}

