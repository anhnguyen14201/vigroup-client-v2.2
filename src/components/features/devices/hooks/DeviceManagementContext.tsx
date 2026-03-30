'use client'

import { useDeviceManagement } from '@/components/features/devices/hooks/useDeviceManagement'
import { createContext, useContext, ReactNode } from 'react'

const DeviceContext = createContext<ReturnType<
  typeof useDeviceManagement
> | null>(null)

export const DeviceManagementProvider = ({
  children,
  itemsPerPage,
}: {
  children: ReactNode
  itemsPerPage: number
}) => {
  const value = useDeviceManagement(itemsPerPage)
  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  )
}

export const useDeviceContext = () => {
  const context = useContext(DeviceContext)
  if (!context)
    throw new Error(
      'useDeviceContext must be used within DeviceManagementProvider',
    )
  return context
}
