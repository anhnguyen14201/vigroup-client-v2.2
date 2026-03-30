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

  // --- 1. SYNC STATES WITH URL (Lazy Init) ---
  const [subTab, _setSubTab] = useState(
    () => searchParams.get('tab') || 'all-projects',
  )
  const isAllProjects = subTab === 'all-projects'

  const [searchQuery, _setSearchQuery] = useState(
    () => searchParams.get('q') || '',
  )
  const [activeLangCode, setActiveLangCode] = useState('vi')
  const [status, _setStatus] = useState(
    () => searchParams.get('status') || 'all',
  )
  const [paymentStatus, _setPaymentStatus] = useState(
    () => searchParams.get('payment') || 'all',
  )

  const [projectPage, _setProjectPage] = useState(() =>
    subTab === 'all-projects' ? Number(searchParams.get('page')) || 1 : 1,
  )
  const [categoryPage, _setCategoryPage] = useState(() =>
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

  // --- 3. DATA FETCHING (Optimized with Conditionals) ---
  const { items: languagesData } = usePaginatedCollection(
    'language',
    {},
    languageService.getLanguages,
  )

  // Chỉ fetch Project Types khi ở tab categories
  const projectTypeParams = useMemo(
    () => ({ search: searchQuery }),
    [searchQuery],
  )
  const projectTypeFetch = usePaginatedCollection(
    !isAllProjects ? 'project-type' : null,
    projectTypeParams,
    projectTypeService.getAll,
    categoryPage,
    itemsPerPage,
  )

  // Select list fetch (luôn fetch nhưng page 1 và không phụ thuộc search chính để tránh giật lag khi gõ)
  const allProjectTypesFetch = usePaginatedCollection(
    'project-type-select',
    { search: '' },
    projectTypeService.getAll,
    1,
    'all',
  )

  // Chỉ fetch Projects khi ở tab all-projects
  const projectParams = useMemo(
    () => ({
      kind: 'project',
      search: searchQuery,
      status: status === 'all' ? '' : status,
      paymentStatus: paymentStatus === 'all' ? '' : paymentStatus,
    }),
    [searchQuery, status, paymentStatus],
  )

  const projectFetch = usePaginatedCollection(
    isAllProjects
      ? `/projects-${subTab}-${status}-${paymentStatus}-${searchQuery}`
      : null,
    projectParams,
    projectService.getProjects,
    projectPage,
    itemsPerPage,
  )

  // --- 4. DERIVED VALUES ---
  const currentTotalPages = isAllProjects
    ? projectFetch.totalPages
    : projectTypeFetch.totalPages
  const isAnyLoading = isAllProjects
    ? projectFetch.isLoading
    : projectTypeFetch.isLoading
  const currentPage = isAllProjects ? projectPage : categoryPage

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
  const setSubTab = useCallback(
    (tab: string) => {
      _setSubTab(tab)
      _setSearchQuery('')
      _setStatus('all')
      _setPaymentStatus('all')
      setQuery({ tab, page: 1, q: '', status: 'all', payment: 'all' })
    },
    [setQuery],
  )

  const setStatus = useCallback(
    (val: string) => {
      _setStatus(val)
      setQuery({ status: val, page: 1 })
    },
    [setQuery],
  )

  const setPaymentStatus = useCallback(
    (val: string) => {
      _setPaymentStatus(val)
      setQuery({ payment: val, page: 1 })
    },
    [setQuery],
  )

  const setCurrentPage = useCallback(
    (page: number) => {
      if (isAllProjects) _setProjectPage(page)
      else _setCategoryPage(page)
      setQuery({ page })
    },
    [isAllProjects, setQuery],
  )

  const setSearchQuery = useCallback(
    (q: string) => {
      _setSearchQuery(q)
      setQuery({ q, page: 1 })
    },
    [setQuery],
  )

  // --- 6. ACTION HANDLERS ---
  const handleOpenDetail = useCallback((project: any) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
  }, [])

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

  const handleConfirmDeleteProject = useCallback(async () => {
    if (!projectToDelete?._id) return
    nProgress.start()
    setIsDeleting(true)
    const toastId = toast.loading('Đang xóa dự án...')
    try {
      await projectService.deleteProject(projectToDelete._id)
      setProjectToDelete(null)
      setIsDeleteModalOpen(false)
      toast.success('Xóa dự án thành công!', { id: toastId })
      await projectFetch.mutate()
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
  }, [projectToDelete, projectFetch])

  const handleConfirmDeleteProjectType = useCallback(async () => {
    if (!deleteId) return
    nProgress.start()
    setIsDeleting(true)
    const toastId = toast.loading('Đang xóa dữ liệu...')
    try {
      await projectTypeService.delete(deleteId)
      setDeleteId(null)
      setIsDeleteModalTypeOpen(false)
      toast.success('Xóa kiểu dự án thành công!', { id: toastId })
      await projectTypeFetch.mutate()
      await allProjectTypesFetch.mutate()
    } catch (error) {
      toast.error('Không thể xóa. Vui lòng thử lại!', { id: toastId })
    } finally {
      setIsDeleting(false)
      nProgress.done()
    }
  }, [deleteId, projectTypeFetch, allProjectTypesFetch])

  // --- 7. AUTO SYNC PAGE FROM URL ---
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    if (subTab === 'all-projects') _setProjectPage(p)
    else _setCategoryPage(p)
  }, [searchParams, subTab])

  // --- 8. MEMOIZED RETURN OBJECT ---
  return useMemo(
    () => ({
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
      currentPage,
      setCurrentPage,
      allProjectTypes: allProjectTypesFetch.items,
      languagesData,
      projectTypeData: projectTypeFetch.items,
      isProjectTypesLoading: projectTypeFetch.isLoading,
      refreshProjectTypes: projectTypeFetch.mutate,
      projectsData: projectFetch.items,
      totalPages: currentTotalPages || 1,
      isLoading: isAnyLoading,
      refreshProjects: projectFetch.mutate,
      status,
      setStatus,
      paymentStatus,
      setPaymentStatus,
      totalItems: projectFetch.totalItems,
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
      refreshAllProjectTypes: allProjectTypesFetch.mutate,
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
    }),
    [
      user,
      subTab,
      searchQuery,
      activeLangCode,
      currentPage,
      currentTotalPages,
      isAnyLoading,
      status,
      paymentStatus,
      isProjectModalOpen,
      selectedProject,
      isCategoryModalOpen,
      selectedCategory,
      isDeleteModalOpen,
      isDeleteModalTypeOpen,
      projectToDelete,
      isDetailModalOpen,
      deleteId,
      isDeleting,
      languagesData,
      projectTypeFetch,
      projectFetch,
      allProjectTypesFetch,
      tabs,
      isAllProjects,
      setSubTab,
      setSearchQuery,
      setCurrentPage,
      setStatus,
      setPaymentStatus,
      handleOpenDetail,
      handleCreateNew,
      handleEditProject,
      handleDeleteProject,
      handleEditCategory,
      handleConfirmDeleteProjectType,
      handleConfirmDeleteProject,
      handleLogout,
    ],
  )
}
