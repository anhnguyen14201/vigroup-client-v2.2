import { api } from '@/lib'

export const userService = {
  fetchMe: async () => {
    const response = await api.get('/users/current', { withCredentials: true })
    return response.data
  },

  getUserAttendances: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/attendance/monthly-summary', {
      params: {
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limit
        ...filters, // Giải nén { tab, search } vào params
      },
      withCredentials: true,
    })
    return response.data
  },
  // Thêm trường id vào trong destructuring của tham số
  getUser: async ({ pageIndex, pageSize, userId, filters }: any) => {
    const response = await api.get('/attendance/attendance-by-month', {
      params: {
        userId, // Truyền ID người d
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limitùng cụ thể
        ...filters, // Truyền thêm month, year nếu cần lấy dữ liệu chấm công tháng đó
      },
      withCredentials: true,
    })
    return response.data
  },

  getUsers: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/users', {
      params: {
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limit
        ...filters, // Giải nén { tab, search } vào params
      },
      withCredentials: true,
    })
    return response.data
  },

  updateUser: async (id: string, data: Record<string, any> | FormData) => {
    //const isForm = typeof FormData !== 'undefined' && data instanceof FormData

    const response = await api.put(`/users/${id}`, data, {
      withCredentials: true,
      //headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined
    })

    return response.data
  },

  updateMe: async (id: string, data: Record<string, any> | FormData) => {
    //const isForm = typeof FormData !== 'undefined' && data instanceof FormData

    const response = await api.put(`/users/me/${id}`, data, {
      withCredentials: true,
      //headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined
    })

    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`, {
      withCredentials: true,
    })

    return response.data
  },
}
