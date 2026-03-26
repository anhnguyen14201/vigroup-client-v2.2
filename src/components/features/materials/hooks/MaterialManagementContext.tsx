'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useMaterialManagement } from './useMaterialManagement'

const MaterialContext = createContext<ReturnType<
  typeof useMaterialManagement
> | null>(null)

export const MaterialManagementProvider = ({
  children,
  itemsPerPage,
}: {
  children: ReactNode
  itemsPerPage: number
}) => {
  const value = useMaterialManagement(itemsPerPage)
  return (
    <MaterialContext.Provider value={value}>
      {children}
    </MaterialContext.Provider>
  )
}

export const useMaterialContext = () => {
  const context = useContext(MaterialContext)
  if (!context)
    throw new Error(
      'useMaterialContext must be used within MaterialManagementProvider',
    )
  return context
}
