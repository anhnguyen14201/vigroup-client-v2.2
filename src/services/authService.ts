import { api } from '@/lib'
import { IUser } from '@/types'

export const authService = {
  signUp: async (data: IUser) => {
    const response = await api.post('/auth/register', data, {
      withCredentials: true,
    })
    return response.data
  },

  signIn: async (username: string, password: string) => {
    const response = await api.post(
      '/auth/login',
      { username, password },
      { withCredentials: true },
    )
    return response.data
  },

  signOut: async () => {
    await api.get('/auth/logout', { withCredentials: true })
  },

  fetchMe: async () => {
    const response = await api.get('/users/me', { withCredentials: true })
    return response.data
  },

  forgotPassword: async (data: any) => {
    const response = await api.post(
      '/auth/forgot-password',
      { data },
      { withCredentials: true },
    )
    return response.data
  },

  resetPassword: async (data: any) => {
    const response = await api.put(
      '/auth/reset-password',
      { data },
      { withCredentials: true },
    )
    return response.data
  },

  loginFB: async (data: any) => {
    const response = await api.post(
      '/auth/facebook-auth',
      { data },
      { withCredentials: true },
    )
    return response.data
  },

  refresh: async () => {
    const response = await api.post(
      '/auth/refresh',
      {},
      { withCredentials: true },
    )
    return response.data.accessToken
  },
}
