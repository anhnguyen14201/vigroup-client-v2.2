import { api } from '@/lib'

export const productService = {
  /**
   * Tạo sản phẩm mới
   * @param data - Thông tin sản phẩm (Tên, giá, mô tả, các ID danh mục/brand...)
   */
  createProduct: async (data: any) => {
    const response = await api.post('/product', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách sản phẩm công khai (Dùng cho Website)
   * @param params - Các filter như page, limit, category, brand...
   */
  getProducts: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/product', {
      params: {
        page: pageIndex,
        limit: pageSize,
        ...filters,
      },
    })
    return response.data
  },

  /**
   * Lấy danh sách sản phẩm theo một mảng IDs
   * Thường dùng cho trang Giỏ hàng hoặc So sánh sản phẩm
   */
  getProductsByIds: async (ids: string[]) => {
    const response = await api.get('/product/products', {
      params: {
        ids: ids.join(','), // Kết quả: "id1,id2,id3"
      },
    })
    return response.data
  },

  /**
   * Lấy danh sách sản phẩm nội bộ (Dùng cho trang Admin/POS)
   * Thường bao gồm cả các sản phẩm đã ẩn hoặc hết hàng
   */
  getProductsPrivate: async (params?: any) => {
    const response = await api.get('/product/private', {
      params,
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy chi tiết sản phẩm qua Slug (Dùng cho trang Chi tiết sản phẩm)
   */
  getProductBySlug: async (slug: string) => {
    const response = await api.get(`/product/${slug}`)
    return response.data
  },

  /**
   * Lấy các sản phẩm liên quan dựa trên Slug sản phẩm hiện tại
   */
  getRelatedProducts: async (slug: string) => {
    const response = await api.get(`/product/${slug}/related`)
    return response.data
  },

  /**
   * Cập nhật thông tin sản phẩm
   */
  updateProduct: async (_id: string, data: any) => {
    const response = await api.put(`/product/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa sản phẩm khỏi hệ thống
   */
  deleteProduct: async (_id: string) => {
    const response = await api.delete(`/product/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },
}
