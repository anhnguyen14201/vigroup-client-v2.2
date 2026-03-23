'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useProjectManagement } from './useProjectManagement'

const ProjectContext = createContext<ReturnType<
  typeof useProjectManagement
> | null>(null)

export const ProjectManagementProvider = ({
  children,
  itemsPerPage,
}: {
  children: ReactNode
  itemsPerPage: number
}) => {
  const value = useProjectManagement(itemsPerPage)
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}

export const useProjectContext = () => {
  const context = useContext(ProjectContext)
  if (!context)
    throw new Error(
      'useProjectContext must be used within ProjectManagementProvider',
    )
  return context
}
