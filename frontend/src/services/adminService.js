import api from './api'
import { API_ENDPOINTS } from '../config'

export const adminService = {
  // Reviews
  async getAllReviews() {
    const response = await api.get(API_ENDPOINTS.ADMIN_REVIEWS)
    return response.data
  },

  async createReview(reviewData) {
    const response = await api.post(API_ENDPOINTS.ADMIN_REVIEWS, reviewData)
    return response.data
  },

  async updateReview(id, reviewData) {
    const response = await api.put(`${API_ENDPOINTS.ADMIN_REVIEWS}/${id}`, reviewData)
    return response.data
  },

  async deleteReview(id) {
    const response = await api.delete(`${API_ENDPOINTS.ADMIN_REVIEWS}/${id}`)
    return response.data
  },

  // Genres
  async getGenres() {
    const response = await api.get(API_ENDPOINTS.ADMIN_GENRES)
    return response.data
  },

  async createGenre(genreData) {
    const response = await api.post(API_ENDPOINTS.ADMIN_GENRES, genreData)
    return response.data
  },

  // TMDB
  async searchTMDB(query) {
    const response = await api.get(`${API_ENDPOINTS.ADMIN_SEARCH_TMDB}?query=${encodeURIComponent(query)}`)
    return response.data
  },

  async getTMDBDetails(tmdbId) {
    const response = await api.get(`${API_ENDPOINTS.ADMIN_TMDB_DETAILS}/${tmdbId}`)
    return response.data
  },

  async createMovieFromTMDB(tmdbId) {
    const response = await api.post(`${API_ENDPOINTS.ADMIN_MOVIE_FROM_TMDB}/${tmdbId}`)
    return response.data
  },
}

