import { api } from '@/lib'

export const purchaseInvoiceService = {
  /**
   * Lấy danh sách hóa đơn vật tư theo Project ID
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

  getAllPurchaseInvoices: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get(
      '/purchase-invoice/monthly-summary-invoices',
      {
        params: {
          page: pageIndex, // Chuyển pageIndex thành page cho backend
          limit: pageSize, // Chuyển pageSize thành limit
          ...filters, // Giải nén { tab, search } vào params
        },
        withCredentials: true,
      },
    )
    return response.data
  },
}
