import { api } from '@/lib'

export const categoryService = {
  /**
   * Tạo danh mục sản phẩm mới
   * @param data - Thông tin danh mục (name, slug, ...)
   */
  createCategory: async (data: any) => {
    const response = await api.post('/category', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy toàn bộ danh mục sản phẩm (Hỗ trợ params nếu backend có phân trang/lọc)
   */
  getCategories: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/category', {
      params: {
        page: pageIndex,
        limit: pageSize,
        ...filters,
      },
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh mục công khai (Không cần login)
   */
  getPublicCategories: async () => {
    const response = await api.get('/category')
    return response.data
  },

  /**
   * Cập nhật thông tin danh mục theo ID
   */
  updateCategory: async (_id: string, data: any) => {
    const response = await api.put(`/category/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa danh mục sản phẩm
   */
  deleteCategory: async (_id: string) => {
    const response = await api.delete(`/category/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh mục con theo ID danh mục cha (Nếu backend hỗ trợ route này)
   */
  getSubCategories: async (parentId: string) => {
    const response = await api.get(`/category/${parentId}/subs`, {
      withCredentials: true,
    })
    return response.data
  },
}
