'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMaterialContext } from '../hooks'
import { MaterialCard } from './MaterialCard'
import Pagination from '@/components/shared/Pagination'
import {
  ConfirmDeleteModal,
  DocumentPreviewModal,
  EmptyState,
  LoadingState,
} from '@/components/shared'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'
import nProgress from 'nprogress'
import { toast } from 'sonner'

export const MaterialList = () => {
  const {
    invoices,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    selectedInvoice,
    setSelectedInvoice,
    handleEditInvoice,
    refreshInvoices,

    // Giả sử context có hàm deleteInvoice
    // deleteInvoice
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

  // Trạng thái cho Sửa & Xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedInvoice?._id) return

    setIsDeleting(true)
    nProgress.start()

    // 1. Khởi tạo toast loading với tên địa điểm mua hàng cho chi tiết
    const toastId = toast.loading(
      `Đang xóa hóa đơn tại ${selectedInvoice.purchasePlace}...`,
    )

    try {
      const result = await purchaseInvoiceService.deletePurchaseInvoice(
        selectedInvoice._id,
      )

      if (result.success) {
        // 2. Đóng modal và reset dữ liệu
        setIsDeleteModalOpen(false)
        setSelectedInvoice(null)

        // 3. Ghi đè toast loading bằng toast thành công
        toast.success(
          `Đã xóa hóa đơn tại ${selectedInvoice.purchasePlace} thành công!`,
          { id: toastId },
        )

        // 4. Refresh danh sách
        refreshInvoices()
      } else {
        // Trường hợp backend trả về lỗi nghiệp vụ
        toast.error(result.message || 'Không thể xóa hóa đơn này.', {
          id: toastId,
        })
      }
    } catch (error: any) {
      // Lỗi mạng hoặc lỗi server
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!',
        { id: toastId },
      )
      console.error('❌ Delete Invoice Error:', error)
    } finally {
      nProgress.done()
      setIsDeleting(false)
    }
  }

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
      {/* <div className='flex items-center justify-between px-2'>
        <span className='text-sm text-slate-500 font-medium'>
          Hiển thị <span className='text-slate-900'>{invoices.length}</span>{' '}
          trên <span className='text-slate-900'>{totalItems}</span> hóa đơn
        </span>
      </div> */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {invoices.map((invoice: any, index: any) => (
          <motion.div
            key={invoice?.employeeId || invoice?._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MaterialCard
              invoice={invoice}
              onPreview={handleOpenPreview}
              onEdit={() => handleEditInvoice(invoice)}
              onDelete={handleDeleteClick}
            />
          </motion.div>
        ))}
      </div>

      {/* 2. Modal Xác nhận xóa */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title='Xóa hóa đơn?'
        description={`Bạn có chắc chắn muốn xóa hóa đơn tại ${selectedInvoice?.purchasePlace}?`}
      />
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
