import { useUserContext } from '@/components/features/user/hooks/UserManagementContext'
import { Pagination } from '@/components/shared'
import React from 'react'

const PaginationWrapper = () => {
  const { finalTotalPages, currentPage, setCurrentPage } = useUserContext()

  return (
    <>
      {finalTotalPages > 1 && (
        <div className='mt-8 md:mt-12'>
          <Pagination
            currentPage={currentPage}
            totalPages={finalTotalPages}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </>
  )
}

export default PaginationWrapper
