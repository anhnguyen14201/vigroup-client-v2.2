import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { projectService } from '@/services'

export const useProjectStatus = (
  project: any,
  mutate: () => void,
  onSuccess?: () => void,
) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const updateStatus = useCallback(
    async (newStatus: string) => {
      // 1. Xác nhận hành động nhạy cảm
      const confirmMessages: Record<string, string> = {
        cancelled: 'Bạn có chắc chắn muốn hủy dự án này?',
        finished: 'Xác nhận hoàn thành dự án?',
      }

      const loadingMessages: Record<string, string> = {
        cancelled: 'Đang hủy dự án...',
        finished: 'Đang hoàn tất dự án...',
        started: 'Đang bắt đầu dự án...',
      }

      if (confirmMessages[newStatus] && !confirm(confirmMessages[newStatus])) {
        return
      }

      // 2. Khởi tạo UI feedback
      setIsUpdating(true)
      const loadingText =
        loadingMessages[newStatus] || 'Đang cập nhật trạng thái...'
      const toastId = toast.loading(loadingText)
      nProgress.start()

      try {
        const payload: any = { status: newStatus }

        // Logic gán ngày tự động
        if (newStatus === 'started') payload.startDate = new Date()
        if (newStatus === 'finished') payload.endDate = new Date()

        // 3. Gọi API
        await projectService.updateStatus(project._id, payload)

        const successText =
          newStatus === 'cancelled'
            ? 'Đã hủy dự án thành công'
            : 'Cập nhật trạng thái thành công'

        toast.success(successText, { id: toastId })
        // 4. Refresh dữ liệu
        if (mutate) await mutate()
        if (onSuccess) onSuccess()
      } catch (error: any) {
        console.error('Update Status Error:', error)
        toast.error(
          error?.response?.data?.message || 'Lỗi khi cập nhật trạng thái',
          { id: toastId },
        )
      } finally {
        setIsUpdating(false)
        nProgress.done()
      }
    },
    [project?._id, mutate, onSuccess],
  )

  return {
    isUpdating,
    updateStatus,
    status: project?.status,
  }
}
