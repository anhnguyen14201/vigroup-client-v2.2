'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { motion } from 'framer-motion'

// Components
import { AddDeviceModal } from '@/components/features/devices/forms/AddDeviceModal'
import { DeviceDetailModal } from '@/components/features/devices/components/DeviceDetailModal'
import DeviceCard from '@/components/features/devices/components/DeviceCard'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal' // Giả định đường dẫn
import Pagination from '@/components/shared/Pagination' // Giả định đường dẫn
import { AdminHeader } from '@/components/layouts'
import {
  EmptyState,
  FloatingActionButton,
  GenericActionBar,
  LoadingState,
} from '@/components/shared'

// Hooks & Services
import {
  DeviceManagementProvider,
  useDeviceContext,
} from '@/components/features/devices/hooks'
import { deviceService } from '@/services'

const DeviceManagementContent = () => {
  const {
    user,
    handleLogout,
    searchQuery,
    setSearchQuery,
    handleCreateNew,
    isDeviceModalOpen,
    setIsDeviceModalOpen,
    devicesData,
    refreshDevices,
    isLoading,
    // Thêm các state phân trang từ context
    currentPage,
    totalPages,
    setCurrentPage,
  } = useDeviceContext()

  const [selectedDevice, setSelectedDevice] = useState<any>(null)

  // State cho việc xóa
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Hàm xử lý khi nhấn "Xác nhận" trên Modal xóa
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    nProgress.start()

    const promise = deviceService.deleteDevice(deleteTarget.id)

    toast.promise(promise, {
      loading: `Đang gỡ bỏ ${deleteTarget.name}...`,
      success: () => {
        refreshDevices()
        setDeleteTarget(null) // Đóng modal
        return `Đã xóa thiết bị ${deleteTarget.name} thành công.`
      },
      error: 'Lỗi: Không thể xóa thiết bị lúc này.',
      finally: () => {
        setIsDeleting(false)
        nProgress.done()
      },
    })
  }

  const [editTarget, setEditTarget] = useState<any>(null)

  // 2. Hàm đóng modal sạch sẽ
  const handleCloseModal = () => {
    setIsDeviceModalOpen(false)
    setEditTarget(null)
  }

  return (
    <>
      <AdminHeader user={user} onLogout={handleLogout}>
        <h1 className='text-lg font-bold tracking-tight text-slate-900 mb-2'>
          Quản lý thiết bị
        </h1>
      </AdminHeader>

      <div className='min-h-screen p-4 md:p-10 font-sans text-slate-900 flex flex-col'>
        <GenericActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={'Nhập vào mã thiết bị...'}
          buttonLabel={'Thêm thiết bị'}
          buttonIcon={Plus}
          onButtonClick={handleCreateNew}
        />
        {/* --- BENTO GRID SYSTEM --- */}
        {isLoading ? (
          <LoadingState />
        ) : devicesData?.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
              <AnimatePresence mode='popLayout'>
                {devicesData.map((device: any, index: number) => (
                  <motion.div
                    key={device?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DeviceCard
                      device={device}
                      index={index}
                      onDelete={(id: any, name: any) =>
                        setDeleteTarget({ id, name })
                      }
                      onEdit={(device: any) => setEditTarget(device)}
                      onClick={() => setSelectedDevice(device)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Chỉ hiện phân trang khi có dữ liệu */}
            <div className='mt-12 py-6 border-t border-slate-50'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

        {/* Modals */}
        <AddDeviceModal
          isOpen={isDeviceModalOpen || !!editTarget}
          device={editTarget} // Truyền dữ liệu vào đây
          onClose={handleCloseModal}
          onRefresh={refreshDevices}
        />
        <DeviceDetailModal
          device={selectedDevice}
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />

        <FloatingActionButton
          onClick={handleCreateNew}
          // icon={Wallet} // Nếu không truyền sẽ mặc định là dấu Plus
        />

        {/* Modal xác nhận xóa */}
        <ConfirmDeleteModal
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
          title={`Xóa ${deleteTarget?.name}?`}
          description='Thiết bị này sẽ bị gỡ khỏi hệ thống Vigroup vĩnh viễn. Bạn chắc chắn chứ?'
        />
      </div>
    </>
  )
}

export default function DeviceManagement() {
  return (
    <DeviceManagementProvider itemsPerPage={8}>
      <DeviceManagementContent />
    </DeviceManagementProvider>
  )
}
