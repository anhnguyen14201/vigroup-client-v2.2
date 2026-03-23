import { api } from '@/lib'

export const projectTypeService = {
  /**
   * Tạo mới loại dự án
   */
  create: async (data: any) => {
    const response = await api.post('/project-type', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách loại dự án (Hỗ trợ Search & Pagination)
   * @param params { search?: string, page?: number, limit?: number }
   */
  getAll: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/project-type', {
      params: {
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limit
        ...filters, // Giải nén { tab, search } vào params
      }, // Axios sẽ tự động biến {search: 'abc'} thành ?search=abc
      withCredentials: true,
    })
    return response.data // Trả về { success: true, data: [...], pagination: {...} }
  },

  /**
   * Cập nhật loại dự án theo ID
   */
  update: async (_id: string, data: any) => {
    const response = await api.put(`/project-type/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa loại dự án theo ID
   */
  delete: async (_id: string) => {
    const response = await api.delete(`/project-type/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },
}
