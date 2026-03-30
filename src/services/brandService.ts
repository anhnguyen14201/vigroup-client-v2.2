import { api } from '@/lib'

export const brandService = {
  /**
   * Tạo thương hiệu mới
   * @param data - Thông tin thương hiệu (name, logo, origin, ...)
   */
  createBrand: async (data: any) => {
    const response = await api.post('/brand', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách toàn bộ thương hiệu (Hỗ trợ phân trang/lọc nếu cần)
   */
  getBrands: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/brand', {
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
   * Lấy danh sách thương hiệu công khai (Dùng cho trang chủ/lọc sản phẩm)
   */
  getPublicBrands: async () => {
    const response = await api.get('/brand')
    return response.data
  },

  /**
   * Cập nhật thông tin thương hiệu theo ID
   */
  updateBrand: async (_id: string, data: any) => {
    const response = await api.put(`/brand/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa thương hiệu
   */
  deleteBrand: async (_id: string) => {
    const response = await api.delete(`/brand/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách các dòng sản phẩm (Collections) thuộc thương hiệu này
   * (Dùng để hiển thị bộ lọc đa tầng mà anh yêu cầu)
   */
  getCollectionsByBrand: async (brandId: string) => {
    const response = await api.get(`/brand/${brandId}/collections`, {
      withCredentials: true,
    })
    return response.data
  },
}
