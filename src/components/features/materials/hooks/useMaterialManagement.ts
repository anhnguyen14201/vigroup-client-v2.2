'use client'

import { useAuth, useQueryState } from '@/hooks'
import { useAuthStore } from '@/stores'

export const useMaterialManagement = (itemsPerPage: number = 6) => {
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any
  const { searchParams, setQuery } = useQueryState()

  return {
    user,
    handleLogout,
  }
}
