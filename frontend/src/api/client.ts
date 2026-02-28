import axios from 'axios'
import type { Community, Property, LoginRequest, LoginResponse, DashboardStats } from '../types'

const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token')
  },
}

export const communityApi = {
  getAll: (params?: { district?: string; search?: string }) =>
    apiClient.get<Community[]>('/communities', { params }),

  getById: (id: number) =>
    apiClient.get<Community>(`/communities/${id}`),

  create: (data: Partial<Community>) =>
    apiClient.post<Community>('/communities', data),

  update: (id: number, data: Partial<Community>) =>
    apiClient.put<Community>(`/communities/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/communities/${id}`),
}

export const propertyApi = {
  getAll: (params?: {
    district?: string
    layout?: string
    min_price?: number
    max_price?: number
  }) =>
    apiClient.get<Property[]>('/properties', { params }),

  getById: (id: number) =>
    apiClient.get<Property>(`/properties/${id}`),

  create: (data: Partial<Property>) =>
    apiClient.post<Property>('/properties', data),

  update: (id: number, data: Partial<Property>) =>
    apiClient.put<Property>(`/properties/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/properties/${id}`),
}

export const dashboardApi = {
  getStats: () =>
    apiClient.get<DashboardStats>('/dashboard/stats'),

  getRecentVisits: () =>
    apiClient.get<Property[]>('/dashboard/recent-visits'),
}

export const uploadApi = {
  uploadPhoto: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{ filename: string; url: string; original_name: string }>(
      '/upload/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  uploadVideo: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{ filename: string; url: string; original_name: string }>(
      '/upload/video',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  deleteFile: async (filename: string) => {
    await apiClient.delete(`/upload/files/${filename}`)
  },
}

export const importApi = {
  downloadCommunityTemplate: () => {
    window.open('/api/import-export/template/community', '_blank')
  },

  downloadPropertyTemplate: () => {
    window.open('/api/import-export/template/property', '_blank')
  },

  importCommunities: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{
      success: boolean
      imported: number
      details: { id: number; name: string }[]
      errors: string[] | null
    }>('/import-export/community', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  importProperties: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{
      success: boolean
      imported: number
      details: { id: number; area: number; price: number }[]
      errors: string[] | null
    }>('/import-export/property', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export default apiClient
