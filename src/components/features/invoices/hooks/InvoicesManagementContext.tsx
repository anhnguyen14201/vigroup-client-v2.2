'use client'

import { useManagement } from './useManagement'
import { createContext, useContext, ReactNode } from 'react'

const InvoicesContext = createContext<ReturnType<typeof useManagement> | null>(
  null,
)

export const InvoicesManagementProvider = ({
  children,
  itemsPerPage,
}: {
  children: ReactNode
  itemsPerPage: number
}) => {
  const value = useManagement(itemsPerPage)
  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  )
}

export const useInvoicesContext = () => {
  const context = useContext(InvoicesContext)
  if (!context)
    throw new Error(
      'useInvoicesContext must be used within InvoicesManagementProvider',
    )
  return context
}
