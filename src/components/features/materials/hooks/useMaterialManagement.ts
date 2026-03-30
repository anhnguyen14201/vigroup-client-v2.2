'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'
import { useAuthStore } from '@/stores'
import { userService } from '@/services'

export const useMaterialManagement = (itemsPerPage: number = 10) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()

  // ==========================================
  // 1. LOCAL STATES (Lazy Init)
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const [currentPage, _setCurrentPage] = useState(
    () => Number(searchParams.get('page')) || 1,
  )
  const [searchTerm, _setSearchTerm] = useState(
    () => searchParams.get('q') || '',
  )
  const [userId, _setUserId] = useState(
    () => searchParams.get('userId') || 'all',
  )
  const [paymentMethod, _setPaymentMethod] = useState(
    () => searchParams.get('paymentMethod') || 'all',
  )
  const [invoiceGroup, _setInvoiceGroup] = useState(
    () => searchParams.get('invoiceGroup') || 'all',
  )
  const [projIds, _setProjIds] = useState(
    () => searchParams.get('projIds') || 'all',
  )
  const [purchasePlace, _setPurchasePlace] = useState(
    () => searchParams.get('purchasePlace') || 'all',
  )

  const [day, _setDay] = useState(() => searchParams.get('day') || 'all')
  const [month, _setMonth] = useState(
    () => Number(searchParams.get('month')) || new Date().getMonth() + 1,
  )
  const [year, _setYear] = useState(
    () => Number(searchParams.get('year')) || new Date().getFullYear(),
  )

  // ==========================================
  // 2. DATA FETCHING (Memoized Params)
  // ==========================================
  const fetchParams = useMemo(
    () => ({
      search: searchTerm,
      userId: userId !== 'all' ? userId : undefined,
      paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
      invoiceGroup: invoiceGroup !== 'all' ? invoiceGroup : undefined,
      projIds: projIds !== 'all' ? projIds : undefined,
      purchasePlace: purchasePlace !== 'all' ? purchasePlace : undefined,
      day: day !== 'all' ? day : undefined,
      month,
      year,
    }),
    [
      searchTerm,
      userId,
      paymentMethod,
      invoiceGroup,
      projIds,
      purchasePlace,
      day,
      month,
      year,
    ],
  )

  // Key cho SWR để cache dữ liệu theo từng bộ lọc
  const collectionKey = useMemo(
    () =>
      `purchase-invoices-${searchTerm}-${userId}-${paymentMethod}-${invoiceGroup}-${projIds}-${purchasePlace}-${day}-${month}-${year}`,
    [
      searchTerm,
      userId,
      paymentMethod,
      invoiceGroup,
      projIds,
      purchasePlace,
      day,
      month,
      year,
    ],
  )

  const {
    items: invoices,
    totalPages,
    totalItems,
    totalInvoiceAmount,
    isLoading,
    mutate: refreshInvoices,
  } = usePaginatedCollection(
    collectionKey,
    fetchParams,
    purchaseInvoiceService.getAllPurchaseInvoices,
    currentPage,
    itemsPerPage,
  )

  // Chỉ fetch dữ liệu hỗ trợ (Staff, Projects, Places) một lần hoặc khi thời gian thay đổi
  const { items: staffData } = usePaginatedCollection(
    '/staff',
    { tab: 'staff' },
    userService.getUsers,
    1,
    'all',
  )

  const summaryParams = useMemo(() => ({ month, year }), [month, year])

  const { items: projectsData } = usePaginatedCollection(
    `/purchase-invoice/purchase-projects-${month}-${year}`,
    summaryParams,
    purchaseInvoiceService.getSummaryPurchaseProjects,
    1,
    'all',
  )

  const { items: placeData } = usePaginatedCollection(
    `/purchase-invoice/purchase-places-${month}-${year}`,
    summaryParams,
    purchaseInvoiceService.getSummaryPurchasePlace,
    1,
    'all',
  )

  // ==========================================
  // 3. SYNC URL EFFECTS
  // ==========================================
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    _setCurrentPage(p)
  }, [searchParams])

  // ==========================================
  // 4. UPDATER FUNCTIONS (Memoized)
  // ==========================================
  const setSearchTerm = useCallback(
    (q: string) => {
      _setSearchTerm(q)
      setQuery({ q, page: 1 })
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

  const setInvoiceGroup = useCallback(
    (val: string) => {
      _setInvoiceGroup(val)
      setQuery({ invoiceGroup: val, page: 1 })
    },
    [setQuery],
  )

  const setPaymentMethod = useCallback(
    (val: string) => {
      _setPaymentMethod(val)
      setQuery({ paymentMethod: val, page: 1 })
    },
    [setQuery],
  )

  const setUserId = useCallback(
    (val: string) => {
      _setUserId(val)
      setQuery({ userId: val, page: 1 })
    },
    [setQuery],
  )

  const setProjIds = useCallback(
    (val: string) => {
      _setProjIds(val)
      setQuery({ projIds: val, page: 1 })
    },
    [setQuery],
  )

  const setPurchasePlace = useCallback(
    (val: string) => {
      _setPurchasePlace(val)
      setQuery({ purchasePlace: val, page: 1 })
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

  const resetFilters = useCallback(() => {
    const dM = new Date().getMonth() + 1
    const dY = new Date().getFullYear()
    _setSearchTerm('')
    _setUserId('all')
    _setPaymentMethod('all')
    _setInvoiceGroup('all')
    _setProjIds('all')
    _setPurchasePlace('all')
    _setDay('all')
    _setMonth(dM)
    _setYear(dY)

    setQuery({
      q: '',
      userId: '',
      paymentMethod: '',
      invoiceGroup: '',
      projIds: '',
      purchasePlace: '',
      day: '',
      month: dM,
      year: dY,
      page: 1,
    })
  }, [setQuery])

  const handleEditInvoice = useCallback((invoice: any) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }, [])

  const handleAddInvoice = useCallback(() => {
    setSelectedInvoice(null)
    setIsModalOpen(true)
  }, [])

  const closeInvoiceModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }, [])

  // ==========================================
  // 5. RETURN MEMOIZED OBJECT
  // ==========================================
  return useMemo(
    () => ({
      user,
      handleLogout,
      invoices: invoices || [],
      totalItems: totalItems || 0,
      totalPages: totalPages || 1,
      isLoading,
      isModalOpen,
      setIsModalOpen,
      selectedInvoice,
      setSelectedInvoice,
      refreshInvoices,
      currentPage,
      searchTerm,
      userId,
      paymentMethod,
      invoiceGroup,
      projIds,
      purchasePlace,
      day,
      month,
      year,
      users: staffData || [],
      projects: projectsData || [],
      places: placeData || [],
      setSearchTerm,
      setCurrentPage,
      setInvoiceGroup,
      setPaymentMethod,
      setUserId,
      setProjIds,
      setPurchasePlace,
      setDateFilter,
      resetFilters,
      handleEditInvoice,
      handleAddInvoice,
      closeInvoiceModal,
      totalInvoiceAmount,
    }),
    [
      user,
      invoices,
      totalItems,
      totalPages,
      isLoading,
      isModalOpen,
      selectedInvoice,
      refreshInvoices,
      currentPage,
      searchTerm,
      userId,
      paymentMethod,
      invoiceGroup,
      projIds,
      purchasePlace,
      day,
      month,
      year,
      staffData,
      projectsData,
      placeData,
      setSearchTerm,
      setCurrentPage,
      setInvoiceGroup,
      setPaymentMethod,
      setUserId,
      setProjIds,
      setPurchasePlace,
      setDateFilter,
      resetFilters,
      handleEditInvoice,
      handleAddInvoice,
      closeInvoiceModal,
      totalInvoiceAmount,
      handleLogout,
    ],
  )
}
