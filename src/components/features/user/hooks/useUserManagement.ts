import { useState, useEffect, useCallback, useMemo } from 'react'
import nProgress from 'nprogress'
import { toast } from 'sonner'

import { authService, userService } from '@/services'
import { useAuthStore } from '@/stores'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import useSWR from 'swr'

export const useUserManagement = (itemsPerPage: number) => {
  // ==========================================
  // 1. ROUTER, STORES & CUSTOM HOOKS
  // ==========================================
  const { searchParams, setQuery } = useQueryState()

  const { user, signOut } = useAuthStore() as any
  const isLoggedIn = !!user
  const currentPlan = user?.tenantId?.plan || 'basic'
  const userRole = user?.role

  // ==========================================
  // 2. LOCAL STATES
  // ==========================================
  // --- States: Danh sách & Bộ lọc (Lấy mặc định từ URL) ---
  const [subTab, _setSubTab] = useState(searchParams.get('tab') || 'staff')
  const [currentPage, _setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  )
  const [searchQuery, _setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedRole, _setSelectedRole] = useState(
    searchParams.get('role') || 'all',
  )
  const [day, _setDay] = useState(searchParams.get('day') || 'all')
  const [month, _setMonth] = useState(
    Number(searchParams.get('month')) || new Date().getMonth() + 1,
  )
  const [year, _setYear] = useState(
    Number(searchParams.get('year')) || new Date().getFullYear(),
  )

  // --- States: UI (Mở form, xóa user...) ---
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<any>(null)

  // --- States: Chi tiết (Detail Modal) ---
  const [selectedDetail, setSelectedDetail] = useState<any>(null)
  const [detailPage, setDetailPage] = useState(1)

  // ==========================================
  // 3. STATIC & MEMOIZED DATA (Lists)
  // ==========================================

  const filteredRoles = useMemo(() => {
    const ROLE_LABELS: Record<number, string> = {
      3515: 'SUPER',
      1413914: 'Admin',
      1311417518: 'Quản lý hệ thống',
      5131612152555: 'Nhân viên',
      19531852011825: 'Kế toán',
      22125518: 'Nhân viên - Vật tư',
      23521311920518: 'Quản trị viên',
    }
    const entries = Object.entries(ROLE_LABELS)
    const currentUserRole = user?.role

    if (currentUserRole === 3515 || currentUserRole === 1413914) return entries
    if (currentUserRole === 1311417518)
      return entries.filter(([val]) => Number(val) !== 1413914)
    return []
  }, [user?.role])

  // ==========================================
  // 4. API FETCHING HOOKS
  // ==========================================
  const {
    items: usersData,
    totalPages: apiTotalPages,
    isLoading,
    totalItems: totalItemsUsers,
    mutate: refresh,
  } = usePaginatedCollection(
    isLoggedIn ? '/attendances' : null,
    { tab: subTab, search: searchQuery, role: selectedRole, day, month, year },
    userService.getUserAttendances,
    currentPage,
    itemsPerPage,
  )

  const {
    items: customerData,
    totalPages: apiTotalCustomerPages,
    isLoading: isLoadingCustomer,
    totalItems: totalItemsCustomer,
    mutate: refreshCustomer,
  } = usePaginatedCollection(
    '/customer',
    { tab: 'customer', search: searchQuery }, // Khách hàng luôn là tab customer
    userService.getUsers,
    currentPage,
    itemsPerPage,
  )

  const detailQueryKey = selectedDetail?.employeeId
    ? [
        `/user-detail/${selectedDetail.employeeId}`,
        detailPage,
        day,
        month,
        year,
        subTab,
      ]
    : null

  const {
    data: swrDetailData,
    isLoading: isDetailLoading,
    mutate: refreshDetail, // Dùng cái này để cập nhật dữ liệu sau khi sửa/xóa
  } = useSWR(
    detailQueryKey,
    () =>
      userService.getUser({
        userId: selectedDetail.employeeId,
        pageIndex: detailPage,
        pageSize: 10,
        filters: { day, month, year, tab: subTab },
      }),
    {
      revalidateOnFocus: false, // Tùy chọn: tắt nếu không muốn tự load lại khi chuyển tab trình duyệt
      keepPreviousData: true, // Giữ dữ liệu cũ trong lúc load page mới (mượt hơn)
    },
  )

  // ==========================================
  // 5. EFFECTS
  // ==========================================
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    _setCurrentPage(p)
  }, [searchParams])

  // ==========================================
  // 6. STATE UPDATERS (Sync with URL Query)
  // ==========================================
  const setSubTab = (tab: string) => {
    _setSubTab(tab)
    _setSearchQuery('') // 1. Reset state local của search về trống

    // 2. Cập nhật URL: chuyển tab, reset page về 1 và xóa param 'q' (search)
    setQuery({
      tab,
      page: 1,
      q: '', // Gửi chuỗi rỗng lên URL để đồng bộ
    })
  }
  const setCurrentPage = (page: number) => {
    _setCurrentPage(page)
    setQuery({ page })
  }

  const setSearchQuery = (q: string) => {
    _setSearchQuery(q)
    setQuery({ q, page: 1 }) // Reset page khi search
  }

  const setSelectedRole = (role: string) => {
    _setSelectedRole(role)
    setQuery({ role, page: 1 })
  }

  const setDateFilter = (d: string | number, m: number, y: number) => {
    _setDay(String(d))
    _setMonth(m)
    _setYear(y)
    setQuery({ day: d, month: m, year: y, page: 1 })
  }

  // ==========================================
  // 7. ACTION HANDLERS
  // ==========================================
  const handleOpenForm = useCallback(
    (userToEdit: any = null) => {
      if (user?.role === 'staff') {
        toast.error('Bạn không có quyền thực hiện thao tác này.')
        return
      }
      setEditingUser(userToEdit)
      setIsFormOpen(true)
    },
    [user?.role],
  )

  const handleSave = async (formData: any) => {
    if (!isLoggedIn) {
      toast.error('Bạn đang dùng bản thử nghiệm (Demo). Vui lòng đăng nhập.')
      return
    }

    nProgress.start()
    const toastId = toast.loading(
      editingUser ? 'Đang cập nhật...' : 'Đang tạo mới...',
    )

    try {
      const payload = {
        ...formData,
        username: formData.phone || formData.email,
        role: subTab === 'staff' ? formData.role || 'staff' : 32119201513518,
      }

      if (editingUser) {
        await userService.updateUser(editingUser.employeeId, payload)
        toast.success('Cập nhật thành công!', { id: toastId })
      } else {
        await authService.signUp(payload)
        toast.success('Thêm mới thành công!', { id: toastId })
      }

      setIsFormOpen(false)
      setEditingUser(null)
      await refresh()
      await refreshCustomer()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra.'
      toast.error('Thao tác thất bại', {
        id: toastId,
        description: errorMessage,
      })
      throw error
    } finally {
      nProgress.done()
    }
  }

  const confirmDelete = async () => {
    if (!deleteId || !isLoggedIn) return

    nProgress.start()
    const toastId = toast.loading('Đang xóa...')
    try {
      await userService.deleteUser(deleteId)
      toast.success('Đã xóa thành công', { id: toastId })
      await refresh()
      await refreshCustomer()
      setDeleteId(null)
    } catch (err: any) {
      toast.error('Xóa thất bại', { id: toastId })
    } finally {
      nProgress.done()
    }
  }

  const { handleLogout } = useAuth()

  const handleViewDetail = useCallback(
    (targetUser: any, page: number = 1, customFilters?: any) => {
      if (!targetUser?.employeeId) return

      setSelectedDetail(targetUser)
      setDetailPage(page)

      // Nếu có truyền customFilters (từ modal lịch sử), cập nhật luôn state global
      /* if (customFilters) {
        if (customFilters.day) _setDay(String(customFilters.day))
        if (customFilters.month) _setMonth(customFilters.month)
        if (customFilters.year) _setYear(customFilters.year)
      } */
    },
    [], // Rất nhẹ nhàng
  )

  const resetAllFilters = () => {
    // 1. Reset các State local về giá trị mặc định
    const defaultMonth = new Date().getMonth() + 1
    const defaultYear = new Date().getFullYear()

    _setSearchQuery('')
    _setSelectedRole('all')
    _setDay('all')
    _setMonth(defaultMonth)
    _setYear(defaultYear)
    _setCurrentPage(1)

    // 2. Reset URL: Chỉ giữ lại subTab hiện tại, xóa sạch các param khác
    setQuery({
      q: '',
      role: '',
      day: '',
      month: defaultMonth,
      year: defaultYear,
      page: 1,
    })
  }

  // ==========================================
  // 8. DERIVED COMPUTED DATA (Logic động)
  // ==========================================

  const totalItems = useMemo(() => {
    return subTab === 'staff' ? totalItemsUsers : totalItemsCustomer
  }, [subTab, totalItemsUsers, totalItemsCustomer])

  const displayData = useMemo(() => {
    return subTab === 'staff' ? usersData : customerData
  }, [subTab, usersData, customerData])

  const finalTotalPages = useMemo(() => {
    return subTab === 'staff' ? apiTotalPages : apiTotalCustomerPages
  }, [subTab, apiTotalPages, apiTotalCustomerPages])

  const isAnyLoading = subTab === 'staff' ? isLoading : isLoadingCustomer

  const userToDelete = useMemo(() => {
    const currentList = displayData || []
    return currentList.find(
      (u: any) => u._id === deleteId || u.employeeId === deleteId,
    )
  }, [deleteId, displayData])

  // ==========================================
  // 9. RETURN OBJECT
  // ==========================================
  return {
    // --- User & Auth ---
    user,
    isLoggedIn,
    currentPlan,
    userRole,

    // --- Tab & Search ---
    subTab,
    setSubTab,
    searchQuery,
    setSearchQuery,

    // --- Pagination ---
    currentPage,
    setCurrentPage,
    finalTotalPages: finalTotalPages || 1,

    // --- Filters ---
    selectedRole,
    setSelectedRole,
    day,
    month,
    year,
    setDateFilter,

    // --- Lists & Constants ---

    filteredRoles,

    // --- Data & Loading ---
    isLoading: isAnyLoading,
    displayUsers: displayData || [],
    totalItems: totalItems || 0,

    usersData,
    apiTotalPages,
    refresh,

    customerData,
    apiTotalCustomerPages,
    isLoadingCustomer,
    refreshCustomer,

    // --- UI States: Form Drawer ---
    isFormOpen,
    setIsFormOpen,
    editingUser,
    setEditingUser,
    handleOpenForm,
    handleSave,

    // --- UI States: Delete Modal ---
    deleteId,
    setDeleteId,
    userToDelete,
    confirmDelete,

    // --- UI States: Detail Modal ---
    selectedDetail,
    setSelectedDetail,
    setDetailPage,

    isDetailLoading,
    handleViewDetail,
    swrDetailData,
    refreshDetail,

    // --- Misc Handlers ---
    signOut,
    handleLogout,
    resetAllFilters,
  }
}
