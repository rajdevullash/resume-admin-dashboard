import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
}

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },
  exportReport: async (type: 'users' | 'subscriptions') => {
    const response = await api.get(`/admin/reports/export?type=${type}`, {
      responseType: 'blob'
    })
    return response.data
  },
}

// Users API
export const usersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },
  
  toggleBlock: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/block`)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },
  
  resetPassword: async (id: string, password: string) => {
    const response = await api.put(`/admin/users/${id}/reset-password`, { password })
    return response.data
  },
}

// Templates API
export const templatesAPI = {
  getAll: async () => {
    const response = await api.get('/templates')
    return response.data
  },
  
  create: async (data: any) => {
    const response = await api.post('/admin/templates', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/admin/templates/${id}`, data)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/admin/templates/${id}`)
    return response.data
  },
  
  clone: async (id: string) => {
    const response = await api.post(`/admin/templates/${id}/clone`)
    return response.data
  },
}

// Alias for templateAPI (singular)
export const templateAPI = {
  getAllTemplates: async () => {
    const response = await api.get('/templates')
    return response.data
  },
  
  createTemplate: async (data: any) => {
    const response = await api.post('/templates', data)
    return response.data
  },
  
  updateTemplate: async (id: string, data: any) => {
    const response = await api.put(`/templates/${id}`, data)
    return response.data
  },
  
  deleteTemplate: async (id: string) => {
    const response = await api.delete(`/templates/${id}`)
    return response.data
  },
}

// User API (singular alias)
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data
  },
  
  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },
  
  resetPassword: async (id: string, password: string) => {
    const response = await api.put(`/admin/users/${id}/reset-password`, { password })
    return response.data
  },
}

// Subscriptions API
export const subscriptionAPI = {
  getAllPlans: async () => {
    const response = await api.get('/admin/subscriptions/plans')
    return response.data
  },
  
  getAllSubscriptions: async () => {
    const response = await api.get('/admin/subscriptions')
    return response.data
  },
  
  createPlan: async (data: any) => {
    const response = await api.post('/admin/subscriptions/plans', data)
    return response.data
  },
  
  updatePlan: async (id: string, data: any) => {
    const response = await api.put(`/admin/subscriptions/plans/${id}`, data)
    return response.data
  },
  
  deletePlan: async (id: string) => {
    const response = await api.delete(`/admin/subscriptions/plans/${id}`)
    return response.data
  },
}

// Content API (CMS)
export const contentAPI = {
  // Blog
  getBlogPosts: async () => {
    const response = await api.get('/content/blog')
    return response.data
  },
  createBlogPost: async (data: any) => {
    const response = await api.post('/content/blog', data)
    return response.data
  },
  updateBlogPost: async (id: string, data: any) => {
    const response = await api.put(`/content/blog/${id}`, data)
    return response.data
  },
  deleteBlogPost: async (id: string) => {
    const response = await api.delete(`/content/blog/${id}`)
    return response.data
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await api.get('/content/announcements')
    return response.data
  },
  createAnnouncement: async (data: any) => {
    const response = await api.post('/content/announcements', data)
    return response.data
  },
  updateAnnouncement: async (id: string, data: any) => {
    const response = await api.put(`/content/announcements/${id}`, data)
    return response.data
  },
  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/content/announcements/${id}`)
    return response.data
  },

  // FAQs
  getFAQs: async () => {
    const response = await api.get('/content/faqs')
    return response.data
  },
  createFAQ: async (data: any) => {
    const response = await api.post('/content/faqs', data)
    return response.data
  },
  updateFAQ: async (id: string, data: any) => {
    const response = await api.put(`/content/faqs/${id}`, data)
    return response.data
  },
  deleteFAQ: async (id: string) => {
    const response = await api.delete(`/content/faqs/${id}`)
    return response.data
  },

  // Resume Examples
  getResumeExamples: async () => {
    const response = await api.get('/content/resume-examples')
    return response.data
  },
  createResumeExample: async (data: any) => {
    const response = await api.post('/content/resume-examples', data)
    return response.data
  },
  updateResumeExample: async (id: string, data: any) => {
    const response = await api.put(`/content/resume-examples/${id}`, data)
    return response.data
  },
  deleteResumeExample: async (id: string) => {
    const response = await api.delete(`/content/resume-examples/${id}`)
    return response.data
  },
}

// Notifications API
export const notificationAPI = {
  send: async (data: { title: string, message: string, target: string, imageUrl?: string }) => {
    const response = await api.post('/admin/notifications/send', data)
    return response.data
  },
  getHistory: async () => {
    const response = await api.get('/admin/notifications/history')
    return response.data
  },
}

// Settings API
export const settingsAPI = {
  get: async () => {
    const response = await api.get('/admin/settings')
    return response.data
  },
  update: async (data: any) => {
    const response = await api.put('/admin/settings', data)
    return response.data
  },
}

// Logs API
export const logsAPI = {
  getAll: async (params: any) => {
    const response = await api.get('/admin/logs', { params })
    return response.data
  },
  undo: async (id: string) => {
    const response = await api.post(`/admin/logs/${id}/undo`)
    return response.data
  },
}

export default api
