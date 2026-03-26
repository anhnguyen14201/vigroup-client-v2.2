'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'
import { useAuthStore } from '@/stores'

export const useMaterialManagement = (itemsPerPage: number = 10) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()

  // ==========================================
  // 1. LOCAL STATES (Sync with URL)
  // ==========================================
  const [currentPage, _setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  )
  const [searchTerm, _setSearchTerm] = useState(searchParams.get('q') || '')

  // Các bộ lọc nâng cao
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
  // 2. API FETCHING
  // ==========================================
  const filterParams = useMemo(
    () => ({
      search: searchTerm,
      userId,
      paymentMethod,
      invoiceGroup,
      projIds,
      purchasePlace,
      day,
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
    isLoading,
    mutate: refreshInvoices,
  } = usePaginatedCollection(
    'purchase-invoices-all', // Key duy nhất cho SWR
    { search: searchTerm, day, month, year },
    purchaseInvoiceService.getAllPurchaseInvoices,
    currentPage,
    itemsPerPage,
  )

  // ==========================================
  // 3. SYNC URL EFFECTS
  // ==========================================
  useEffect(() => {
    const p = Number(searchParams.get('page')) || 1
    _setCurrentPage(p)
  }, [searchParams])

  // ==========================================
  // 4. UPDATER FUNCTIONS
  // ==========================================
  const setSearchTerm = (q: string) => {
    _setSearchTerm(q)
    setQuery({ q, page: 1 })
  }

  const setCurrentPage = (page: number) => {
    _setCurrentPage(page)
    setQuery({ page })
  }

  // Hàm cập nhật filter tổng hợp
  const updateFilters = (newFilters: any) => {
    if (newFilters.userId) _setUserId(newFilters.userId)
    if (newFilters.paymentMethod) _setPaymentMethod(newFilters.paymentMethod)
    if (newFilters.invoiceGroup) _setInvoiceGroup(newFilters.invoiceGroup)
    if (newFilters.projIds) _setProjIds(newFilters.projIds)
    if (newFilters.purchasePlace) _setPurchasePlace(newFilters.purchasePlace)

    setQuery({ ...newFilters, page: 1 })
  }

  const setDateFilter = (d: string | number, m: number, y: number) => {
    _setDay(String(d))
    _setMonth(m)
    _setYear(y)
    setQuery({ day: d, month: m, year: y, page: 1 })
  }

  const resetFilters = () => {
    const defaultMonth = new Date().getMonth() + 1
    const defaultYear = new Date().getFullYear()

    _setSearchTerm('')
    _setUserId('all')
    _setPaymentMethod('all')
    _setInvoiceGroup('all')
    _setProjIds('all')
    _setPurchasePlace('all')
    _setDay('all')
    _setMonth(defaultMonth)
    _setYear(defaultYear)

    setQuery({
      q: '',
      userId: '',
      paymentMethod: '',
      invoiceGroup: '',
      projIds: '',
      purchasePlace: '',
      day: '',
      month: defaultMonth,
      year: defaultYear,
      page: 1,
    })
  }

  return {
    // Auth
    user,
    handleLogout,

    // Data
    invoices: invoices || [],
    totalItems: totalItems || 0,
    totalPages: totalPages || 1,
    isLoading,
    refreshInvoices,

    // Filter States
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

    // Handlers
    setSearchTerm,
    setCurrentPage,
    updateFilters,
    setDateFilter,
    resetFilters,
  }
}
