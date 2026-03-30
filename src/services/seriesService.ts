import { api } from '@/lib'

export const seriesService = {
  /**
   * Tạo dòng sản phẩm (Series/Collection) mới
   * @param data - Thông tin dòng sản phẩm (name, brandId, description, ...)
   */
  createSeries: async (data: any) => {
    const response = await api.post('/series', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy toàn bộ danh sách dòng sản phẩm
   */
  getAllSeries: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/series', {
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
   * Lấy danh sách Series công khai (Dùng cho menu lọc ngoài Website)
   */
  getPublicSeries: async () => {
    const response = await api.get('/series')
    return response.data
  },

  /**
   * Cập nhật thông tin dòng sản phẩm theo ID
   */
  updateSeries: async (_id: string, data: any) => {
    const response = await api.put(`/series/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa dòng sản phẩm
   */
  deleteSeries: async (_id: string) => {
    const response = await api.delete(`/series/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách Series theo Thương hiệu (Dùng cho logic lọc đa tầng)
   * @param brandId - ID của thương hiệu chủ quản
   */
  getSeriesByBrand: async (brandId: string) => {
    const response = await api.get('/series', {
      params: { brand: brandId },
      withCredentials: true,
    })
    return response.data
  },
}
