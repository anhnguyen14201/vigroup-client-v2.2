'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'
import { useAuthStore } from '@/stores'
import { projectService, userService } from '@/services'

export const useMaterialManagement = (itemsPerPage: number = 10) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Thêm vào phần LOCAL STATES
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  // ==========================================
  // 1. LOCAL STATES (Sync ban đầu từ URL)
  // ==========================================
  const [currentPage, _setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  )
  const [searchTerm, _setSearchTerm] = useState(searchParams.get('q') || '')

  // Bộ lọc nâng cao
  const [userId, _setUserId] = useState(searchParams.get('userId') || 'all')
  const [paymentMethod, _setPaymentMethod] = useState(
    searchParams.get('paymentMethod') || 'all',
  )
  const [invoiceGroup, _setInvoiceGroup] = useState(
    searchParams.get('invoiceGroup') || 'all',
  )
  const [projIds, _setProjIds] = useState(searchParams.get('projIds') || 'all')
  const [purchasePlace, _setPurchasePlace] = useState(
    searchParams.get('purchasePlace') || 'all',
  )

  // Lọc ngày tháng năm
  const [day, _setDay] = useState(searchParams.get('day') || 'all')
  const [month, _setMonth] = useState(
    Number(searchParams.get('month')) || new Date().getMonth() + 1,
  )
  const [year, _setYear] = useState(
    Number(searchParams.get('year')) || new Date().getFullYear(),
  )

  // ==========================================
  // 2. DATA FETCHING (Gom tất cả filters vào đây)
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

  const {
    items: invoices,
    totalPages,
    totalItems,
    totalInvoiceAmount,
    isLoading,
    mutate: refreshInvoices,
  } = usePaginatedCollection(
    'purchase-invoices-all',
    fetchParams,
    purchaseInvoiceService.getAllPurchaseInvoices,
    currentPage,
    itemsPerPage,
  )

  const { items: staffData } = usePaginatedCollection(
    '/staff',
    { tab: 'staff' }, // Khách hàng luôn là tab customer
    userService.getUsers,
    1,
    'all',
  )

  const { items: projectsData } = usePaginatedCollection(
    `/purchase-invoice/purchase-projects`,
    { month, year },
    purchaseInvoiceService.getSummaryPurchaseProjects,
    1,
    'all',
  )
  const { items: placeData } = usePaginatedCollection(
    `/purchase-invoice/purchase-places`,
    { month, year },
    purchaseInvoiceService.getSummaryPurchasePlace,
    1,
    'all',
  )

  // Giả định lấy list từ service khác hoặc fetch riêng (cần bổ sung để list filter có data)
  const users = staffData // Fetch từ userService
  const projects = projectsData // Fetch từ projectService
  const places = placeData

  // ==========================================
  // 3. SYNC URL EFFECTS
  // ==========================================
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    _setCurrentPage(p)
  }, [searchParams])

  // ==========================================
  // 4. UPDATER FUNCTIONS (Viết gọn lại để dùng trực tiếp)
  // ==========================================
  const setSearchTerm = (q: string) => {
    _setSearchTerm(q)
    setQuery({ q, page: 1 })
  }

  const setCurrentPage = (page: number) => {
    _setCurrentPage(page)
    setQuery({ page })
  }

  const setInvoiceGroup = (val: string) => {
    _setInvoiceGroup(val)
    setQuery({ invoiceGroup: val, page: 1 })
  }

  const setPaymentMethod = (val: string) => {
    _setPaymentMethod(val)
    setQuery({ paymentMethod: val, page: 1 })
  }

  const setUserId = (val: string) => {
    _setUserId(val)
    setQuery({ userId: val, page: 1 })
  }

  const setProjIds = (val: string) => {
    _setProjIds(val)
    setQuery({ projIds: val, page: 1 })
  }

  const setPurchasePlace = (val: string) => {
    _setPurchasePlace(val)
    setQuery({ purchasePlace: val, page: 1 })
  }

  const setDateFilter = (d: string | number, m: number, y: number) => {
    _setDay(String(d))
    _setMonth(m)
    _setYear(y)
    setQuery({ day: d, month: m, year: y, page: 1 })
  }

  const resetFilters = () => {
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
  }

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleAddInvoice = () => {
    setSelectedInvoice(null)
    setIsModalOpen(true)
  }

  const closeInvoiceModal = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  return {
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
    users, // Truyền xuống để Filter có data render
    projects, // Truyền xuống để Filter có data render
    places,
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
  }
}
