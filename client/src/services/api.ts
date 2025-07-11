import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const turfAPI = {
  getAllTurfs: () => api.get('/'),
  getTurf: (id: number) => api.get(`/turf/${id}`),
  getSlots: (turfId: number) => api.get(`/turf/${turfId}/slots`),
  bookSlot: (slotId: number) => api.post(`/book/${slotId}`),
}

export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
  getBookings: () => api.get('/user/bookings'),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllBookings: () => api.get('/admin/bookings'),
  getUpcomingBookings: () => api.get('/admin/upcoming'),
  markPaid: (bookingId: number) => api.post(`/admin/mark-paid/${bookingId}`),
}