'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui'

interface ConfirmDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  loading?: boolean // Thêm loading nếu muốn disable nút khi đang xóa
}

const ConfirmDeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  title = 'Xác nhận xóa?',
  description = 'Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.',
  loading = false,
}: ConfirmDeleteModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='rounded-3xl border-none shadow-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl font-bold text-slate-900'>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-slate-500 font-medium'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='gap-3 mt-4'>
          <AlertDialogCancel
            disabled={loading}
            className='rounded-xl border-slate-200 font-bold text-slate-400 hover:bg-slate-50 h-12 flex-1 cursor-pointer'
          >
            HỦY BỎ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault() // Ngăn đóng modal ngay lập tức để xử lý logic xóa
              onConfirm()
            }}
            disabled={loading}
            className='rounded-xl bg-red-500 hover:bg-red-600 font-bold text-white h-12 flex-1 cursor-pointer transition-all active:scale-95'
          >
            {loading ? 'ĐANG XÓA...' : 'XÁC NHẬN XÓA'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDeleteModal
