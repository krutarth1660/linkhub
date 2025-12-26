import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  me: () => api.get('/auth/me'),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (data: any) => api.put('/users/profile', data),
  
  getDashboard: () => api.get('/users/dashboard'),
}

// Links API
export const linksAPI = {
  getLinks: () => api.get('/links'),
  
  createLink: (data: any) => api.post('/links', data),
  
  updateLink: (id: string, data: any) => api.put(`/links/${id}`, data),
  
  deleteLink: (id: string) => api.delete(`/links/${id}`),
  
  reorderLinks: (data: { links: { id: string; position: number }[] }) =>
    api.put('/links/reorder', data),
}

// Analytics API
export const analyticsAPI = {
  trackClick: (data: { linkId: string; userId: string }) =>
    api.post('/analytics/clicks', data),
  
  getOverview: () => api.get('/analytics/overview'),
  
  getDetailed: () => api.get('/analytics/detailed'),
}

// Public API
export const publicAPI = {
  getProfile: (username: string) =>
    axios.get(`${API_BASE_URL}/public/profile/${username}`),
  
  checkUsername: (username: string) =>
    axios.get(`${API_BASE_URL}/public/username/${username}/available`),
}