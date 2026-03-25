'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import nProgress from 'nprogress'
import { toast } from 'sonner'
import { LayoutGrid, HardHat } from 'lucide-react'
import { projectTypeService, languageService, projectService } from '@/services'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import { useAuthStore } from '@/stores'

export const useProjectManagement = (itemsPerPage: number = 6) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()

  // --- 1. SYNC STATES WITH URL ---
  const [subTab, _setSubTab] = useState(
    searchParams.get('tab') || 'all-projects',
  )
  const isAllProjects = subTab === 'all-projects'

  const [searchQuery, _setSearchQuery] = useState(searchParams.get('q') || '')

  const [activeLangCode, setActiveLangCode] = useState('vi')

  const [status, _setStatus] = useState(searchParams.get('status') || 'all')
  const [paymentStatus, _setPaymentStatus] = useState(
    searchParams.get('payment') || 'all',
  )

  // Thay vì: const [currentPage, _setCurrentPage] = useState(...)

  // Hãy đổi thành:
  const [projectPage, _setProjectPage] = useState(
    subTab === 'all-projects' ? Number(searchParams.get('page')) || 1 : 1,
  )

  const [categoryPage, _setCategoryPage] = useState(
    subTab === 'categories' ? Number(searchParams.get('page')) || 1 : 1,
  )

  // --- 2. MODAL & ACTION STATES ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleteModalTypeOpen, setIsDeleteModalTypeOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleOpenDetail = (project: any) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
  }

  // --- 3. DATA FETCHING ---
  const { items: languagesData } = usePaginatedCollection(
    'language',
    {},
    languageService.getLanguages,
  )

  const {
    items: projectTypeData,
    totalPages: categoryTotalPages,
    mutate: refreshProjectTypes,
    isLoading: isProjectTypesLoading,
  } = usePaginatedCollection(
    'project-type',
    { search: searchQuery },
    projectTypeService.getAll,
    categoryPage,
    itemsPerPage,
  )

  const { items: allProjectTypes, mutate: refreshAllProjectTypes } =
    usePaginatedCollection(
      'project-type', // Key cố định cho Select
      { search: '' },
      projectTypeService.getAll,
      1,
      'all', // Lấy 100 cái để chắc chắn bao phủ hết các loại
    )

  const {
    items: projectsData,
    totalItems,
    totalPages: projectsTotalPages,
    isLoading: isProjectsLoading,
    mutate: refreshProjects,
  } = usePaginatedCollection(
    `/projects-${subTab}-${status}-${paymentStatus}-${searchQuery}`,
    {
      kind: 'project',
      search: searchQuery,
      status: status === 'all' ? '' : status,
      paymentStatus: paymentStatus === 'all' ? '' : paymentStatus,
    },
    projectService.getProjects,
    projectPage,
    itemsPerPage,
  )

  // --- 4. DERIVED VALUES ---

  const currentTotalPages = isAllProjects
    ? projectsTotalPages
    : categoryTotalPages
  const isAnyLoading = isAllProjects ? isProjectsLoading : isProjectTypesLoading

  const tabs = useMemo(
    () => [
      {
        id: 'all-projects',
        label: 'Tất cả dự án',
        icon: HardHat,
        activeColor: 'text-primary',
      },
      {
        id: 'categories',
        label: 'Kiểu dự án',
        icon: LayoutGrid,
        activeColor: 'text-indigo-600',
      },
    ],
    [],
  )

  // --- 5. UPDATER HANDLERS (URL Sync) ---
  const setSubTab = (tab: string) => {
    _setSubTab(tab)
    _setSearchQuery('')
    _setStatus('all')
    _setPaymentStatus('all')

    setQuery({
      tab,
      page: 1,
      q: '',
      status: 'all',
      payment: 'all',
    })
  }

  const setStatus = (val: string) => {
    _setStatus(val)
    setQuery({ status: val, page: 1 })
  }

  const setPaymentStatus = (val: string) => {
    _setPaymentStatus(val)
    setQuery({ payment: val, page: 1 })
  }

  const setCurrentPage = (page: number) => {
    if (isAllProjects) {
      _setProjectPage(page)
    } else {
      _setCategoryPage(page)
    }
    setQuery({ page }) // Cập nhật URL
  }
  const setSearchQuery = (q: string) => {
    _setSearchQuery(q)
    setQuery({ q, page: 1 })
  }

  // --- 6. ACTION HANDLERS ---
  const handleCreateNew = useCallback(() => {
    if (isAllProjects) {
      setSelectedProject(null)
      setIsProjectModalOpen(true)
    } else {
      setSelectedCategory(null)
      setIsCategoryModalOpen(true)
    }
  }, [isAllProjects])

  const handleEditProject = useCallback((project: any) => {
    setSelectedProject(project)
    setIsProjectModalOpen(true)
  }, [])

  const handleDeleteProject = useCallback((project: any) => {
    setProjectToDelete(project)
    setIsDeleteModalOpen(true)
  }, [])

  const handleEditCategory = useCallback((category: any) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }, [])

  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete?._id) return

    nProgress.start()
    setIsDeleting(true)
    const toastId = toast.loading('Đang xóa dự án...')

    try {
      // đổi tên method này theo service thực tế của bạn nếu khác
      await projectService.deleteProject(projectToDelete._id)

      setProjectToDelete(null)
      setIsDeleteModalOpen(false)

      toast.success('Xóa dự án thành công!', { id: toastId })

      await refreshProjects()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Không thể xóa dự án. Vui lòng thử lại!',
        { id: toastId },
      )
    } finally {
      setIsDeleting(false)
      nProgress.done()
    }
  }

  const handleConfirmDeleteProjectType = async () => {
    if (!deleteId) {
      return
    }
    nProgress.start()
    setIsDeleting(true)
    const toastId = toast.loading('Đang xóa dữ liệu...')

    try {
      await projectTypeService.delete(deleteId)
      setDeleteId(null)
      setIsDeleteModalTypeOpen(false)

      toast.success('Xóa kiểu dự án thành công!', { id: toastId })
      await refreshProjectTypes()
      await refreshAllProjectTypes()
    } catch (error) {
      toast.error('Không thể xóa. Vui lòng thử lại!', { id: toastId })
    } finally {
      setIsDeleting(false)
      nProgress.done()
    }
  }

  // --- 7. AUTO SYNC PAGE FROM URL ---
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    if (subTab === 'all-projects') {
      _setProjectPage(p)
    } else {
      _setCategoryPage(p)
    }
  }, [searchParams, subTab])

  return {
    user,
    handleLogout,

    subTab,
    setSubTab,
    searchQuery,
    setSearchQuery,
    activeLangCode,
    setActiveLangCode,

    tabs,
    isAllProjects,

    currentPage: isAllProjects ? projectPage : categoryPage,
    setCurrentPage,

    allProjectTypes,

    languagesData,
    projectTypeData,
    isProjectTypesLoading,
    refreshProjectTypes,
    projectsData,
    totalPages: currentTotalPages || 1,
    isLoading: isAnyLoading,
    refreshProjects,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    totalItems,

    isProjectModalOpen,
    setIsProjectModalOpen,
    selectedProject,
    setSelectedProject,

    isCategoryModalOpen,
    setIsCategoryModalOpen,
    selectedCategory,
    setSelectedCategory,

    handleOpenDetail,

    isDeleteModalOpen,
    setIsDeleteModalOpen,
    refreshAllProjectTypes,
    isDeleteModalTypeOpen,
    setIsDeleteModalTypeOpen,
    projectToDelete,
    setProjectToDelete,

    handleCreateNew,
    handleEditProject,
    handleDeleteProject,
    handleEditCategory,

    isDetailModalOpen,
    setIsDetailModalOpen,

    deleteId,
    setDeleteId,
    isDeleting,
    handleConfirmDeleteProjectType,
    handleConfirmDeleteProject,

    openDeleteConfirm: (id: string) => setDeleteId(id),
  }
}
