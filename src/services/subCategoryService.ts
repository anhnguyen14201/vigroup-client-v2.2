import { api } from '@/lib'

export const subCategoryService = {
  /**
   * Tạo danh mục con mới
   * @param data - Thông tin danh mục con (name, parentId, ...)
   */
  createSubCategory: async (data: any) => {
    const response = await api.post('/sub-category', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách toàn bộ danh mục con (Có hỗ trợ lọc qua params)
   */
  getSubCategories: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/sub-category', {
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
   * Lấy danh mục con công khai (Dùng cho Website bán hàng)
   */
  getPublicSubCategories: async () => {
    const response = await api.get('/sub-category')
    return response.data
  },

  /**
   * Cập nhật thông tin danh mục con theo ID
   */
  updateSubCategory: async (_id: string, data: any) => {
    const response = await api.put(`/sub-category/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa danh mục con
   */
  deleteSubCategory: async (_id: string) => {
    const response = await api.delete(`/sub-category/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh mục con theo ID danh mục cha (Lọc phía Client/Backend)
   * @param parentId - ID của danh mục chính
   */
  getSubsByParent: async (parentId: string) => {
    const response = await api.get('/sub-category', {
      params: { parent: parentId },
      withCredentials: true,
    })
    return response.data
  },
}
