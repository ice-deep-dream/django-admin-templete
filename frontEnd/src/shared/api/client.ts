import axios from 'axios'
import { useAuthStore } from '@/shared/stores'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && typeof body === 'object' && 'code' in body && 'data' in body) {
      if (body.code >= 200 && body.code < 300) {
        response.data = body.data
      } else {
        const err = new Error(body.message || '请求失败')
        ;(err as unknown as { response: { data: unknown } }).response = { data: body }
        return Promise.reject(err)
      }
    }
    return response
  },
  (error) => {
    const body = error.response?.data
    if (body && typeof body === 'object' && 'message' in body) {
      error.message = body.message
    }
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
