import { api } from '@/lib'

export const deviceService = {
  /**
   * Tạo thiết bị mới
   * @param data - Thông tin thiết bị hoặc FormData nếu có file
   */
  createDevice: async (data: any) => {
    const response = await api.post('/device', data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Lấy danh sách thiết bị có phân trang và lọc
   */
  getDevices: async ({ pageIndex, pageSize, filters }: any) => {
    const response = await api.get('/device', {
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
   * Lấy danh sách thiết bị công khai (không cần login)
   */
  getPublicDevices: async () => {
    const response = await api.get('/device')
    return response.data
  },

  /**
   * Lấy chi tiết một thiết bị theo ID
   */
  getDeviceById: async (_id: string) => {
    const response = await api.get(`/device/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Cập nhật thông tin thiết bị
   */
  updateDevice: async (_id: string, data: any) => {
    const response = await api.put(`/device/${_id}`, data, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Xóa thiết bị
   */
  deleteDevice: async (_id: string) => {
    const response = await api.delete(`/device/${_id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Thêm sự kiện (bảo trì, sửa chữa...) cho thiết bị
   */
  addEventToEquipment: async (_id: string, data: any) => {
    const response = await api.post(`/device/${_id}/events`, data, {
      withCredentials: true,
    })
    return response.data
  },
}
