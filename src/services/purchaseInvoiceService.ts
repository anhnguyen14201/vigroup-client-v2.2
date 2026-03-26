import { api } from '@/lib'

export const purchaseInvoiceService = {
  getSummaryPurchaseProjects: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/purchase-invoice/purchase-projects', {
      params: {
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limit
        ...filters, // Giải nén { tab, search } vào params
      },
      withCredentials: true,
    })
    return response.data
  },

  getSummaryPurchasePlace: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/purchase-invoice/purchase-places', {
      params: {
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limit
        ...filters, // Giải nén { tab, search } vào params
      },
      withCredentials: true,
    })
    return response.data
  },

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
