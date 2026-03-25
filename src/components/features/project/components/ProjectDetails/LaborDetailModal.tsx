'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import nProgress from 'nprogress'

import { attendanceService, projectService } from '@/services'
import { usePaginatedCollection } from '@/hooks'
import { Pagination } from '@/components/shared' // Import component phân trang của bạn
import AttendanceDayItem from '@/components/features/user/components/HistoryTab/AttendanceDayItem'

const LaborDetailModal = ({ isOpen, onClose, employee, projectId }: any) => {
  const [page, setPage] = useState(1) // Quản lý trang hiện tại

  // 1. Fetch dữ liệu lịch trình - Page được gắn vào state 'page'
  const {
    items: attendanceData,
    totalPages, // Lấy totalPages từ hook
    totalItems,
    isLoading,
    mutate: refresh,
  } = usePaginatedCollection(
    isOpen && employee?._id && projectId ? '/attendance/by-project' : null,
    {
      projectId: projectId,
      employeeId: employee?._id,
    },
    attendanceService.getAttendanceByProjectAndEmployee,
    page,
    10, // Mỗi trang hiển thị 10 ngày làm việc
  )

  const handleEditShift = (
    recordId: string,
    shift: any,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    /* setSelectedShift(shift)
    setActiveAttendanceId(recordId) */
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className='fixed inset-0 z-250 flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='relative bg-slate-50 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]'
            >
              {/* Header */}
              <div className='p-8 bg-slate-900 text-white relative shrink-0'>
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center'>
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className='text-xl font-black uppercase tracking-tight text-white'>
                      Lịch trình chi tiết
                    </h2>
                    <p className='text-slate-400 text-xs font-bold uppercase tracking-widest'>
                      {employee?.fullName} • {totalItems} ngày công
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className='absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className='p-6 overflow-y-auto no-scrollbar h-full flex-1 space-y-4'>
                {isLoading ? (
                  <div className='flex flex-col items-center justify-center py-20 italic text-slate-400'>
                    <Loader2 className='animate-spin mb-2' size={32} />
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : attendanceData?.length > 0 ? (
                  <>
                    {attendanceData.map((dayItem: any) => (
                      <AttendanceDayItem
                        key={dayItem._id}
                        dayItem={dayItem}
                        handleEditShift={handleEditShift}
                      />
                    ))}

                    {/* PHÂN TRANG: Hiển thị khi có nhiều hơn 1 trang */}
                    {totalPages > 1 && (
                      <div className='py-6 border-t border-slate-100 flex justify-center bg-white/50 rounded-3xl mt-4'>
                        <Pagination
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={setPage}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center py-20 text-slate-400'>
                    <AlertCircle size={40} className='mb-3 opacity-20' />
                    <p className='font-medium italic'>
                      Không có dữ liệu chấm công.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* <EditShiftModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedShift={selectedShift}
        startedProjects={startedProjects}
        onSubmit={onEditSubmit}
      /> */}
    </>
  )
}

export default LaborDetailModal
