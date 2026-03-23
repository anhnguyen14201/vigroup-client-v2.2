import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { attendanceService, projectService, userService } from '@/services'
import { usePaginatedCollection } from '@/hooks'
import { Pagination } from '@/components/shared'
import DateFilter from '@/components/shared/DateFilter'
import { toast } from 'sonner'
import nProgress from 'nprogress'

import AttendanceDayItem from './AttendanceDayItem'
import EditShiftModal from './EditShiftModal'
import { useUserContext } from '../../hooks/UserManagementContext'

const HistoryTab = () => {
  const { selectedDetail } = useUserContext()
  const [historyFilter, setHistoryFilter] = useState({
    day: 'all',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeAttendanceId, setActiveAttendanceId] = useState<string>('')
  const [page, setPage] = useState(1)

  // Fetch Projects
  const { items: projects } = usePaginatedCollection(
    '/projects',
    {},
    projectService.getProjects,
    1,
    'all',
  )
  const startedProjects = projects.filter(
    (project: any) => project.status === 'started',
  )

  // Fetch History Data
  const {
    items: historyData,
    isLoading: isHistoryLoading,
    mutate: refreshHistory,
  } = usePaginatedCollection(
    selectedDetail ? `/user-detail/${selectedDetail.employeeId}` : null,
    { userId: selectedDetail?.employeeId, ...historyFilter },
    userService.getUser,
    page,
    10,
  )

  const getVNProjectName = (project: any) => {
    if (!project) return 'Chưa xác định'
    const vnTranslation = project.translations?.find(
      (t: any) => t.language?.code === 'vi',
    )
    return vnTranslation?.projectName || project.projectName || ''
  }

  const handleEditShift = (
    recordId: string,
    shift: any,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    setSelectedShift(shift)
    setActiveAttendanceId(recordId)
    setIsModalOpen(true)
  }

  const onSubmit = async (values: any) => {
    const toastId = toast.loading('Đang cập nhật dữ liệu...')
    try {
      nProgress.start()
      const payload = {
        shiftId: selectedShift._id,
        ...values,
        type: values.projectId === 'travel_default' ? 'travel' : 'work',
      }
      const result = await attendanceService.updateAttendance(
        activeAttendanceId,
        payload,
      )
      if (result) {
        await refreshHistory()
        toast.success('Cập nhật ca làm việc thành công!', { id: toastId })
        setIsModalOpen(false)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đã có lỗi xảy ra!', {
        id: toastId,
      })
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <h3 className='text-xl font-black text-slate-800 uppercase'>
          Nhật ký công việc
        </h3>
        <DateFilter
          day={historyFilter.day}
          month={historyFilter.month}
          year={historyFilter.year}
          onFilterChange={(d: any, m: any, y: any) =>
            setHistoryFilter({ day: d, month: m, year: y })
          }
        />
      </div>

      <div className='flex-1 space-y-4 pb-10'>
        {isHistoryLoading ? (
          <div className='flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed'>
            <Loader2 className='animate-spin text-primary mb-2' />
            <span className='text-slate-400 font-medium'>
              Đang truy xuất dữ liệu...
            </span>
          </div>
        ) : historyData.items?.length > 0 ? (
          historyData.items.map((dayItem: any) => (
            <AttendanceDayItem
              key={dayItem._id}
              dayItem={dayItem}
              handleEditShift={handleEditShift}
            />
          ))
        ) : (
          <div className='text-center py-20 text-slate-400 italic'>
            Chưa có dữ liệu hoạt động.
          </div>
        )}

        {historyData.pagination?.totalPages > 1 && (
          <div className='mt-auto py-6 border-t border-slate-100 flex justify-center bg-white/80 backdrop-blur-md sticky bottom-0'>
            <Pagination
              currentPage={historyData.pagination.currentPage}
              totalPages={historyData.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <EditShiftModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedShift={selectedShift}
        startedProjects={startedProjects}
        getVNProjectName={getVNProjectName}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default HistoryTab
