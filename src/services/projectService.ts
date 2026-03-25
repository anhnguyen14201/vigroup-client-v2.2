import { api } from '@/lib'

export const projectService = {
  getProjects: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/projects', {
      params: {
        page: pageIndex,
        limit: pageSize,
        ...filters,
      },
      withCredentials: true,
    })
    return response.data
  },

  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  getProjectBySlug: async (slug: string) => {
    const response = await api.get(`/projects/slug/${slug}`)
    return response.data
  },

  // Cập nhật trạng thái (Start/End/Cancel)
  updateStatus: async (id: string, data: any) => {
    const response = await api.put(`/projects/${id}/status`, data)
    return response.data
  },

  // --- QUẢN LÝ KHÁCH HÀNG TRONG DỰ ÁN ---

  addCustomerToProject: async (data: any) => {
    const response = await api.post('/projects/add-customer-user', data)
    return response.data
  },

  deleteCustomerInProject: async (projectId: string, customerId: string) => {
    const response = await api.delete(
      `/projects/${projectId}/customers/${customerId}`,
    )
    return response.data
  },

  // --- QUẢN LÝ TÀI CHÍNH (DEPOSIT & PAYMENT) ---

  createDeposit: async (id: string, data: any) => {
    const response = await api.post(`/projects/${id}/deposit`, data)
    return response.data
  },

  deleteDeposit: async (id: string) => {
    const response = await api.delete(`/projects/${id}/deposit/`)
    return response.data
  },

  createPayment: async (id: string, data: any) => {
    const response = await api.post(`/projects/${id}/payment`, data)
    return response.data
  },

  // data ở đây có thể chứa id của đợt thanh toán cần xóa
  deletePayment: async (id: string, data: any) => {
    const response = await api.delete(`/projects/${id}/payment`, { data })
    return response.data
  },

  // Tạo mới dự án
  createProject: async (formData: FormData) => {
    const response = await api.post('/projects', formData, {
      withCredentials: true,
      // Axios tự nhận diện FormData và set boundary cho multipart/form-data
    })
    return response.data
  },

  // Cập nhật dự án
  updateProject: async (id: string, formData: FormData) => {
    const response = await api.put(`/projects/${id}`, formData, {
      withCredentials: true,
    })
    return response.data
  },

  // Xóa dự án (nếu Anh cần)
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`, {
      withCredentials: true,
    })
    return response.data
  },
}
