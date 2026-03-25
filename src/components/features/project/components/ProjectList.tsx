'use client'

import ProjectCard from '@/components/features/project/components/ProjectCard'
import ProjectTypeTable from '@/components/features/project/components/ProjectTypeTable'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import { EmptyState, LoadingState, Pagination } from '@/components/shared'

const ProjectList = () => {
  const {
    isAllProjects,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    // Data
    projectTypeData,
    // Modal States & Handlers
    isLoading,
    projectsData,
  } = useProjectContext()

  if (isLoading) {
    return <LoadingState />
  }

  if (projectsData.length === 0) {
    return <EmptyState />
  }
  return (
    <div className='flex-1'>
      {isAllProjects ? (
        <>
          <ProjectCard />

          {/* THÊM PHÂN TRANG CHO PROJECT TẠI ĐÂY */}
          {
            <div className='mt-8 mb-10'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
          }
        </>
      ) : (
        <>
          <div>
            <ProjectTypeTable />
          </div>

          {projectTypeData.length > 0 && (
            <div className='mt-4 mb-10'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProjectList
