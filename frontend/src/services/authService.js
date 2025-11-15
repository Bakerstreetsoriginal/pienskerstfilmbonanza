import api from './api'
import { API_ENDPOINTS } from '../config'

export const authService = {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password })
    return {
      access_token: response.data.access_token,
      token_type: response.data.token_type
    }
  },

  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.ME)
    return response.data
  },
}

