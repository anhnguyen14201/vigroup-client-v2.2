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
