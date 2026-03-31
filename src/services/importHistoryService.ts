import { api } from '@/lib'

export const importHistoryService = {
  /**
   * Lấy danh sách toàn bộ lịch sử nhập hàng (Admin/POS)
   * Thường dùng để xem biến động kho và giá vốn tổng quát
   * @param params - { page, limit, startDate, endDate, search... }
   */
  getImportHistory: async (params?: any) => {
    const response = await api.get('/import-history', {
      params,
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Tạo một bản ghi nhập hàng mới (Dành cho nhập hàng bổ sung)
   * @param data - { productId, quantityImported, importPrice, salePrice, note, importDate }
   */
  createImportRecord: async (data: any) => {
    const response = await api.post('/import-history', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Cập nhật thông tin bản ghi nhập hàng (Sửa lỗi nhập liệu)
   * @param historyId - ID của bản ghi lịch sử
   * @param data - Các thông tin cần sửa (thường là số lượng, giá hoặc ghi chú)
   */
  updateImportRecord: async (historyId: string, data: any) => {
    const response = await api.put(`/import-history/${historyId}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy lịch sử nhập hàng của một sản phẩm cụ thể
   * Giúp theo dõi biến động giá nhập của riêng sản phẩm đó qua các đợt
   * @param productId - ID của sản phẩm
   */
  getHistoryByProduct: async (productId: string) => {
    const response = await api.get(`/import-history/product/${productId}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa một bản ghi lịch sử nhập hàng (nếu cần thiết)
   * Lưu ý: Việc xóa này nên được cân nhắc kỹ vì ảnh hưởng đến báo cáo tài chính
   */
  deleteImportRecord: async (historyId: string) => {
    const response = await api.delete(`/import-history/${historyId}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xuất báo cáo nhập hàng (Gợi ý thêm nếu Anh cần làm tính năng Export Excel)
   */
  exportHistory: async (params?: any) => {
    const response = await api.get('/import-history/export', {
      params,
      withCredentials: true,
      responseType: 'blob', // Để tải file
    })
    return response.data
  },
}
