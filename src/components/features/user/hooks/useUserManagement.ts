import { useState, useEffect, useCallback, useMemo } from 'react'
import nProgress from 'nprogress'
import { toast } from 'sonner'
import useSWR from 'swr'

import { authService, userService } from '@/services'
import { useAuthStore } from '@/stores'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'

export const useUserManagement = (itemsPerPage: number) => {
  const { searchParams, setQuery } = useQueryState()
  const { user, signOut } = useAuthStore() as any
  const { handleLogout } = useAuth()

  const isLoggedIn = !!user
  const currentPlan = user?.tenantId?.plan || 'basic'
  const userRole = user?.role

  // ==========================================
  // 2. LOCAL STATES
  // ==========================================
  const [subTab, _setSubTab] = useState(
    () => searchParams.get('tab') || 'staff',
  )
  const [currentPage, _setCurrentPage] = useState(
    () => Number(searchParams.get('page')) || 1,
  )
  const [searchQuery, _setSearchQuery] = useState(
    () => searchParams.get('q') || '',
  )
  const [selectedRole, _setSelectedRole] = useState(
    () => searchParams.get('role') || 'all',
  )
  const [day, _setDay] = useState(() => searchParams.get('day') || 'all')
  const [month, _setMonth] = useState(
    () => Number(searchParams.get('month')) || new Date().getMonth() + 1,
  )
  const [year, _setYear] = useState(
    () => Number(searchParams.get('year')) || new Date().getFullYear(),
  )

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<any>(null)
  const [selectedDetail, setSelectedDetail] = useState<any>(null)
  const [detailPage, setDetailPage] = useState(1)

  // ==========================================
  // 3. MEMOIZED DATA
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
    if (userRole === 3515 || userRole === 1413914) return entries
    if (userRole === 1311417518)
      return entries.filter(([val]) => Number(val) !== 1413914)
    return []
  }, [userRole])

  // ==========================================
  // 4. API FETCHING (Optimized)
  // ==========================================

  // Chỉ fetch dữ liệu nhân viên khi ở tab staff
  const staffParams = useMemo(
    () => ({
      tab: subTab,
      search: searchQuery,
      role: selectedRole,
      day,
      month,
      year,
    }),
    [subTab, searchQuery, selectedRole, day, month, year],
  )

  const staffFetch = usePaginatedCollection(
    isLoggedIn && subTab === 'staff' ? '/attendances' : null,
    staffParams,
    userService.getUserAttendances,
    currentPage,
    itemsPerPage,
  )

  // Chỉ fetch dữ liệu khách hàng khi ở tab customer
  const customerParams = useMemo(
    () => ({ tab: 'customer', search: searchQuery }),
    [searchQuery],
  )

  const customerFetch = usePaginatedCollection(
    isLoggedIn && subTab === 'customer' ? '/customer' : null,
    customerParams,
    userService.getUsers,
    currentPage,
    itemsPerPage,
  )

  const detailQueryKey = useMemo(
    () =>
      selectedDetail?.employeeId
        ? [
            `/user-detail/${selectedDetail.employeeId}`,
            detailPage,
            day,
            month,
            year,
            subTab,
          ]
        : null,
    [selectedDetail?.employeeId, detailPage, day, month, year, subTab],
  )

  const {
    data: swrDetailData,
    isLoading: isDetailLoading,
    mutate: refreshDetail,
  } = useSWR(
    detailQueryKey,
    () =>
      userService.getUser({
        userId: selectedDetail.employeeId,
        pageIndex: detailPage,
        pageSize: 10,
        filters: { day, month, year, tab: subTab },
      }),
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  // ==========================================
  // 5. SYNC EFFECTS
  // ==========================================
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    _setCurrentPage(p)
  }, [searchParams])

  // ==========================================
  // 6. MEMOIZED UPDATERS
  // ==========================================
  const setSubTab = useCallback(
    (tab: string) => {
      _setSubTab(tab)
      _setSearchQuery('')
      setQuery({ tab, page: 1, q: '' })
    },
    [setQuery],
  )

  const setCurrentPage = useCallback(
    (page: number) => {
      _setCurrentPage(page)
      setQuery({ page })
    },
    [setQuery],
  )

  const setSearchQuery = useCallback(
    (q: string) => {
      _setSearchQuery(q)
      setQuery({ q, page: 1 })
    },
    [setQuery],
  )

  const setSelectedRole = useCallback(
    (role: string) => {
      _setSelectedRole(role)
      setQuery({ role, page: 1 })
    },
    [setQuery],
  )

  const setDateFilter = useCallback(
    (d: string | number, m: number, y: number) => {
      _setDay(String(d))
      _setMonth(m)
      _setYear(y)
      setQuery({ day: d, month: m, year: y, page: 1 })
    },
    [setQuery],
  )

  const resetAllFilters = useCallback(() => {
    const defaultMonth = new Date().getMonth() + 1
    const defaultYear = new Date().getFullYear()
    _setSearchQuery('')
    _setSelectedRole('all')
    _setDay('all')
    _setMonth(defaultMonth)
    _setYear(defaultYear)
    _setCurrentPage(1)
    setQuery({
      q: '',
      role: '',
      day: '',
      month: defaultMonth,
      year: defaultYear,
      page: 1,
    })
  }, [setQuery])

  // ==========================================
  // 7. ACTION HANDLERS
  // ==========================================
  const handleOpenForm = useCallback(
    (userToEdit: any = null) => {
      if (userRole === 'staff') {
        toast.error('Bạn không có quyền thực hiện thao tác này.')
        return
      }
      setEditingUser(userToEdit)
      setIsFormOpen(true)
    },
    [userRole],
  )

  const handleSave = useCallback(
    async (formData: any) => {
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
          const targetId =
            subTab === 'staff'
              ? editingUser.employeeId || editingUser._id
              : editingUser._id
          await userService.updateUser(targetId, payload)
          toast.success('Cập nhật thành công!', { id: toastId })
        } else {
          await authService.signUp(payload)
          toast.success('Thêm mới thành công!', { id: toastId })
        }
        setIsFormOpen(false)
        setEditingUser(null)
        staffFetch.mutate()
        customerFetch.mutate()
      } catch (error: any) {
        toast.error('Thao tác thất bại', {
          id: toastId,
          description: error.response?.data?.message || 'Có lỗi xảy ra.',
        })
      } finally {
        nProgress.done()
      }
    },
    [isLoggedIn, editingUser, subTab, staffFetch, customerFetch],
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteId || !isLoggedIn) return
    nProgress.start()
    const toastId = toast.loading('Đang xóa...')
    try {
      await userService.deleteUser(deleteId)
      toast.success('Đã xóa thành công', { id: toastId })
      staffFetch.mutate()
      customerFetch.mutate()
      setDeleteId(null)
    } catch (err: any) {
      toast.error('Xóa thất bại', { id: toastId })
    } finally {
      nProgress.done()
    }
  }, [deleteId, isLoggedIn, staffFetch, customerFetch])

  const handleViewDetail = useCallback((targetUser: any, page: number = 1) => {
    if (!targetUser?.employeeId) return
    setSelectedDetail(targetUser)
    setDetailPage(page)
  }, [])

  // ==========================================
  // 8. DERIVED COMPUTED DATA
  // ==========================================
  const isStaff = subTab === 'staff'
  const displayUsers = isStaff
    ? staffFetch.items || []
    : customerFetch.items || []
  const totalItems = isStaff
    ? staffFetch.totalItems || 0
    : customerFetch.totalItems || 0
  const finalTotalPages = Math.max(
    isStaff ? staffFetch.totalPages || 1 : customerFetch.totalPages || 1,
    1,
  )
  const isLoading = isStaff ? staffFetch.isLoading : customerFetch.isLoading

  const userToDelete = useMemo(
    () =>
      displayUsers.find(
        (u: any) => u._id === deleteId || u.employeeId === deleteId,
      ),
    [deleteId, displayUsers],
  )

  // ==========================================
  // 9. RETURN MEMOIZED OBJECT
  // ==========================================
  return useMemo(
    () => ({
      user,
      isLoggedIn,
      currentPlan,
      userRole,
      subTab,
      setSubTab,
      searchQuery,
      setSearchQuery,
      currentPage,
      setCurrentPage,
      finalTotalPages,
      selectedRole,
      setSelectedRole,
      day,
      month,
      year,
      setDateFilter,
      filteredRoles,
      isLoading,
      displayUsers,
      totalItems,
      refresh: staffFetch.mutate,
      customerData: customerFetch.items,
      refreshCustomer: customerFetch.mutate,
      isFormOpen,
      setIsFormOpen,
      editingUser,
      setEditingUser,
      handleOpenForm,
      handleSave,
      deleteId,
      setDeleteId,
      userToDelete,
      confirmDelete,
      selectedDetail,
      setSelectedDetail,
      setDetailPage,
      isDetailLoading,
      handleViewDetail,
      swrDetailData,
      refreshDetail,
      signOut,
      handleLogout,
      resetAllFilters,
    }),
    [
      user,
      isLoggedIn,
      currentPlan,
      userRole,
      subTab,
      setSubTab,
      searchQuery,
      setSearchQuery,
      currentPage,
      setCurrentPage,
      finalTotalPages,
      selectedRole,
      setSelectedRole,
      day,
      month,
      year,
      setDateFilter,
      filteredRoles,
      isLoading,
      displayUsers,
      totalItems,
      staffFetch.mutate,
      customerFetch.items,
      customerFetch.mutate,
      isFormOpen,
      editingUser,
      handleOpenForm,
      handleSave,
      deleteId,
      userToDelete,
      confirmDelete,
      selectedDetail,
      isDetailLoading,
      handleViewDetail,
      swrDetailData,
      refreshDetail,
      signOut,
      handleLogout,
      resetAllFilters,
    ],
  )
}
