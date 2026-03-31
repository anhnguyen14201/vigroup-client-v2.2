'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import nProgress from 'nprogress'
import { toast } from 'sonner'
import { LayoutGrid, HardHat, FileText, ShieldCheck } from 'lucide-react'
import { projectTypeService, languageService, projectService } from '@/services'
import { useAuth, usePaginatedCollection, useQueryState } from '@/hooks'
import { useAuthStore } from '@/stores'

export const useManagement = (itemsPerPage: number = 6) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()

  // --- 1. SYNC STATES WITH URL (Lazy Init) ---
  const [subTab, _setSubTab] = useState(
    () => searchParams.get('tab') || 'all-quotations',
  )
  const isAllQuotations = subTab === 'all-quotations'
  const [searchQuery, _setSearchQuery] = useState(
    () => searchParams.get('q') || '',
  )
  const [activeLangCode, setActiveLangCode] = useState('vi')

  // --- 3. DATA FETCHING (Optimized with Conditionals) ---
  const { items: languagesData } = usePaginatedCollection(
    'language',
    {},
    languageService.getLanguages,
  )

  const tabs = useMemo(
    () => [
      {
        id: 'all-quotations',
        label: 'Báo giá',
        icon: FileText, // Hoặc Receipt nếu thiên về tài chính
        activeColor: 'text-primary',
      },
      {
        id: 'warranty',
        label: 'Bảo hành',
        icon: ShieldCheck, // Hoặc Wrench nếu thiên về kỹ thuật sửa chữa
        activeColor: 'text-indigo-600',
      },
    ],
    [],
  )

  const setSubTab = useCallback(
    (tab: string) => {
      _setSubTab(tab)
      _setSearchQuery('')
      /*  _setStatus('all')
      _setPaymentStatus('all') */
      setQuery({ tab, page: 1, q: '', status: 'all', payment: 'all' })
    },
    [setQuery],
  )

  // --- 8. MEMOIZED RETURN OBJECT ---
  return useMemo(
    () => ({
      user,
      handleLogout,
      subTab,
      tabs,
      searchQuery,

      activeLangCode,
      setActiveLangCode,

      isAllQuotations,

      languagesData,
      setSubTab,
    }),
    [
      user,
      subTab,
      tabs,
      searchQuery,
      setSubTab,
      activeLangCode,

      languagesData,

      isAllQuotations,

      handleLogout,
    ],
  )
}
