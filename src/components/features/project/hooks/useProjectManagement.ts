'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import nProgress from 'nprogress'
import { toast } from 'sonner'
import { LayoutGrid, HardHat } from 'lucide-react'
import { projectTypeService, languageService } from '@/services'
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
  const [currentPage, _setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  )
  const [searchQuery, _setSearchQuery] = useState(searchParams.get('q') || '')

  const [activeLangCode, setActiveLangCode] = useState('vi')
  const [dateFilter, setDateFilter] = useState({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  })

  // --- 2. MODAL & ACTION STATES ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // --- 3. DATA FETCHING ---
  const { items: languagesData } = usePaginatedCollection(
    'language',
    {},
    languageService.getLanguages,
  )

  const {
    items: projectTypeData,
    totalPages,
    mutate: refreshProjectTypes,
    isLoading: isProjectTypesLoading,
  } = usePaginatedCollection(
    'project-type',
    { search: searchQuery },
    projectTypeService.getAll,
    currentPage,
    itemsPerPage,
  )

  // --- 4. DERIVED VALUES ---
  const isAllProjects = subTab === 'all-projects'

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
    setQuery({ tab, page: 1 })
  }

  const setCurrentPage = (page: number) => {
    _setCurrentPage(page)
    setQuery({ page })
  }

  const setSearchQuery = (q: string) => {
    _setSearchQuery(q)
    setQuery({ q, page: 1 })
  }

  // --- 6. ACTION HANDLERS ---
  const handleCreateNew = useCallback(() => {
    if (isAllProjects) {
      setIsProjectModalOpen(true)
    } else {
      setSelectedCategory(null)
      setIsCategoryModalOpen(true)
    }
  }, [isAllProjects])

  const handleEditCategory = useCallback((category: any) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteId) return

    nProgress.start()
    setIsDeleting(true)
    const toastId = toast.loading('Đang xóa dữ liệu...')

    try {
      await projectTypeService.delete(deleteId)
      toast.success('Xóa loại dự án thành công!', { id: toastId })
      await refreshProjectTypes()
      setDeleteId(null)
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
    _setCurrentPage(p)
  }, [searchParams])

  return {
    // Auth & User
    user,
    handleLogout,

    // Filter & Search
    subTab,
    setSubTab,
    searchQuery,
    setSearchQuery,
    activeLangCode,
    setActiveLangCode,
    dateFilter,
    setDateFilter,
    tabs,
    isAllProjects,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages: totalPages || 1,

    // Data
    languagesData,
    projectTypeData,
    isProjectTypesLoading,
    refreshProjectTypes,

    // Modal States & Handlers
    isProjectModalOpen,
    setIsProjectModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    selectedCategory,
    setSelectedCategory,
    handleCreateNew,
    handleEditCategory,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    typeToDelete,
    setTypeToDelete,

    // Delete Logic
    deleteId,
    setDeleteId,
    isDeleting,
    handleConfirmDelete,
    openDeleteConfirm: (id: string) => setDeleteId(id), // alias cho đồng bộ naming
  }
}
