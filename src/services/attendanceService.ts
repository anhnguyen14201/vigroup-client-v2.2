import { api } from '@/lib'

export const attendanceService = {
  getAttendances: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/projects', {
      params: {
        page: pageIndex, // Chuyển pageIndex thành page cho backend
        limit: pageSize, // Chuyển pageSize thành limit
        ...filters, // Giải nén { tab, search } vào params
      },
      withCredentials: true,
    })
    return response.data
  },

  updateAttendance: async (
    id: string,
    data: Record<string, any> | FormData,
  ) => {
    // Tự động kiểm tra nếu data là FormData để Axios xử lý header phù hợp
    const response = await api.put(`/attendance/update/${id}`, data, {
      withCredentials: true,
      // Nếu bạn dùng instance axios có tên là 'api',
      // axios sẽ tự xử lý 'Content-Type': 'multipart/form-data' khi thấy data là FormData
    })

    return response.data
  },
}
