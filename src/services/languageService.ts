import { api } from '@/lib'

export const languageService = {
  /**
   * Lấy danh sách ngôn ngữ hệ thống
   */
  getLanguages: async () => {
    const response = await api.get('/language', {
      withCredentials: true,
    })
    return response.data
  },
}
