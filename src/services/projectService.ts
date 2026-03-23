import { api } from '@/lib'

export const projectService = {
  getProjects: async ({ pageIndex, pageSize, filters }: any) => {
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
}
