'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMaterialContext } from '../hooks'
import { MaterialCard } from './MaterialCard'
import Pagination from '@/components/shared/Pagination'
import {
  DocumentPreviewModal,
  EmptyState,
  LoadingState,
} from '@/components/shared'

export const MaterialList = () => {
  const {
    invoices,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
  } = useMaterialContext()

  // Trạng thái modal
  const [previewConfig, setPreviewConfig] = useState<{
    isOpen: boolean
    files: string[]
    index: number
  }>({
    isOpen: false,
    files: [],
    index: 0,
  })

  const handleOpenPreview = (files: string[], index: number) => {
    setPreviewConfig({ isOpen: true, files, index })
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (invoices.length === 0) {
    return <EmptyState />
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between px-2'>
        <span className='text-sm text-slate-500 font-medium'>
          Hiển thị <span className='text-slate-900'>{invoices.length}</span>{' '}
          trên <span className='text-slate-900'>{totalItems}</span> hóa đơn
        </span>
      </div>{' '}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {invoices.map((invoice: any, index: any) => (
          <motion.div
            key={invoice?.employeeId || invoice?._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MaterialCard
              key={invoice._id}
              invoice={invoice}
              onPreview={handleOpenPreview}
            />
          </motion.div>
        ))}
      </div>
      <div className='mt-4'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* Render Modal */}
      {previewConfig.isOpen && (
        <DocumentPreviewModal
          files={previewConfig.files}
          initialIndex={previewConfig.index}
          onClose={() => setPreviewConfig({ ...previewConfig, isOpen: false })}
        />
      )}
    </div>
  )
}
