'use client'

import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import { deviceService } from '@/services'
import { useAuthStore } from '@/stores'
import { useState, useCallback, useMemo, useEffect } from 'react'

export const useDeviceManagement = (itemsPerPage: number = 8) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()

  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)

  // 1. Lazy Initialization: Chỉ đọc URL 1 lần khi mount
  const [searchQuery, _setSearchQuery] = useState(
    () => searchParams.get('q') || '',
  )
  const [currentPage, _setCurrentPage] = useState(
    () => Number(searchParams.get('page')) || 1,
  )

  // 2. Đồng bộ State khi URL thay đổi (Back/Forward browser)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const p = Number(searchParams.get('page')) || 1
    _setSearchQuery(q)
    _setCurrentPage(p)
  }, [searchParams])

  // 3. Memoized Updaters
  const setSearchQuery = useCallback(
    (q: string) => {
      _setSearchQuery(q)
      _setCurrentPage(1)
      setQuery({ q, page: 1 })
    },
    [setQuery],
  )

  const setCurrentPage = useCallback(
    (page: number) => {
      _setCurrentPage(page)
      setQuery({ page }) // Giữ nguyên các params khác trong URL
    },
    [setQuery],
  )

  const handleCreateNew = useCallback(() => {
    setIsDeviceModalOpen(true)
  }, [])

  // 4. Data Fetching
  const queryConfig = useMemo(() => ({ search: searchQuery }), [searchQuery])

  const {
    items: devicesData,
    mutate: refreshDevices,
    isLoading,
    totalItems,
  } = usePaginatedCollection(
    // Dùng key động để SWR tự động fetch lại khi search thay đổi
    `devices-${searchQuery}`,
    queryConfig,
    deviceService.getDevices,
    currentPage,
    itemsPerPage,
  )

  // 5. Derived Values
  const totalPages = useMemo(
    () => Math.ceil((totalItems || 0) / itemsPerPage),
    [totalItems, itemsPerPage],
  )

  // 6. Toàn bộ object trả về được Memoize
  return useMemo(
    () => ({
      user,
      handleLogout,
      searchQuery,
      setSearchQuery,
      handleCreateNew,
      isDeviceModalOpen,
      setIsDeviceModalOpen,
      devicesData: devicesData || [],
      refreshDevices,
      isLoading,
      currentPage,
      totalPages: totalPages || 1,
      setCurrentPage,
      totalItems: totalItems || 0,
    }),
    [
      user,
      handleLogout,
      searchQuery,
      setSearchQuery,
      handleCreateNew,
      isDeviceModalOpen,
      devicesData,
      refreshDevices,
      isLoading,
      currentPage,
      totalPages,
      setCurrentPage,
      totalItems,
    ],
  )
}
