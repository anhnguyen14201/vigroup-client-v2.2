import { api } from '@/lib'

export const purchaseInvoiceService = {
  createPurchaseInvoice: async (formData: FormData) => {
    const response = await api.post('/purchase-invoice', formData, {
      withCredentials: true,
    })
    return response.data
  },

  updatePurchaseInvoice: async (_id: string, data: any) => {
    const response = await api.put(`/purchase-invoice/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  deletePurchaseInvoice: async (_id: string) => {
    const response = await api.delete(`/purchase-invoice/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

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
