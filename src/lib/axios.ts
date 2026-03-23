import { useAuthStore } from '@/stores'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register')
    ) {
      return Promise.reject(error)
    }

    originalRequest._retryCount = originalRequest._retryCount || 0

    if (error.response && error.response.status === 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1
      try {
        const response = await api.post('/auth/refresh', {}, { withCredentials: true })
        const newAccessToken = response.data.accessToken
        useAuthStore.getState().setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (reffreshError) {
        useAuthStore.getState().clearState()
        return Promise.reject(reffreshError)
      }
    }

    return Promise.reject(error)
  }
)
export default api
