import { api } from '@/lib'

export const purchaseInvoiceService = {
  /**
   * Lấy danh sách hóa đơn vật tư theo Project ID
   * Phù hợp để dùng với Hook usePaginatedCollection trong Tab 'materials'
   */
  getAllPurchaseInvoiceByProjectId: async ({
    projectId,
    pageIndex,
    pageSize,
    filters,
  }: any) => {
    const response = await api.get(`/purchase-invoice/${projectId}/invoices`, {
      params: {
        page: pageIndex,
        limit: pageSize,
        ...filters,
      },
      withCredentials: true,
    })
    return response.data
  },

  // Bạn có thể thêm các method khác tại đây sau này
  // Ví dụ: createInvoice, updateInvoice, deleteInvoice...
}
