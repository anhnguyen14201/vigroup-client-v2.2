// @/components/features/user/hooks/UserManagementContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useUserManagement } from './useUserManagement' // Hook cũ của bạn

const UserContext = createContext<ReturnType<typeof useUserManagement> | null>(
  null,
)

export const UserManagementProvider = ({
  children,
  itemsPerPage,
}: {
  children: ReactNode
  itemsPerPage: number
}) => {
  // ĐÂY LÀ NƠI DUY NHẤT GỌI HOOK
  const value = useUserManagement(itemsPerPage)

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUserContext must be used within Provider')
  return context
}
