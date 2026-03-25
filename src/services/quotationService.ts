import { api } from '@/lib'

export const quotationService = {
  // Lấy tất cả báo giá (hỗ trợ phân trang và filter)
  getQuotations: async (filters: any) => {
    const response = await api.get('/quotations', {
      params: filters,
      withCredentials: true,
    })
    return response.data
  },

  // Tạo mới một báo giá (Quotation hoặc Variation)
  createQuotation: async (data: any) => {
    const response = await api.post('/quotations', data, {
      withCredentials: true,
    })
    return response.data
  },

  // Cập nhật thông tin báo giá theo ID
  updateQuotation: async (id: string, data: any) => {
    const response = await api.put(`/quotations/${id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  // Xóa báo giá
  deleteQuotation: async (id: string) => {
    const response = await api.delete(`/quotations/${id}`, {
      withCredentials: true,
    })
    return response.data
  },

  // API hỗ trợ lấy báo giá riêng lẻ theo Project (Nếu backend của Anh có endpoint này)
  getQuotationsByProject: async (projectId: string) => {
    const response = await api.get(`/quotations/project/${projectId}`, {
      withCredentials: true,
    })
    return response.data
  },
}
