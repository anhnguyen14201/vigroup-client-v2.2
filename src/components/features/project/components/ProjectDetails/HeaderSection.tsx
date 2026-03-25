import ActionButton from './ActionButton'
import { formatDateCzech, getVNProjectName } from '@/utils'
import {
  Calendar,
  CheckCircle2,
  Play,
  XCircle,
  ShieldCheck,
  Ban,
  Loader2,
  X,
} from 'lucide-react'
import { projectService } from '@/services' // Import service của bạn
import { toast } from 'sonner'
import { useState } from 'react'
import nProgress from 'nprogress'

const HeaderSection = ({ project, mutate, setIsDetailModalOpen }: any) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const status = project?.status

  const handleUpdateStatus = async (newStatus: string) => {
    // Xác nhận trước khi hủy hoặc kết thúc để tránh bấm nhầm
    if (
      newStatus === 'cancelled' &&
      !confirm('Bạn có chắc chắn muốn hủy dự án này?')
    )
      return
    if (newStatus === 'finished' && !confirm('Xác nhận hoàn thành dự án?'))
      return

    setIsUpdating(true)
    const toastId = toast.loading('Đang cập nhật trạng thái...')
    nProgress.start()

    try {
      const payload = { status: newStatus }

      // Nếu bắt đầu thì gán startDate là hiện tại, nếu kết thúc thì gán endDate
      if (newStatus === 'started') (payload as any).startDate = new Date()
      if (newStatus === 'finished') (payload as any).endDate = new Date()

      await projectService.updateStatus(project._id, payload)
      setIsDetailModalOpen(false)
      toast.success('Cập nhật trạng thái thành công', { id: toastId })

      // Gọi hàm mutate để fetch lại dữ liệu mới nhất (nếu dùng SWR/React Query)
      mutate()
    } catch (error: any) {
      console.error(error)
      toast.error('Lỗi khi cập nhật trạng thái', { id: toastId })
    } finally {
      setIsUpdating(false)
      setIsDetailModalOpen(false)
      nProgress.done()
    }
  }

  return (
    <div className='bg-[#0F172A] p-6 md:p-10 text-white shrink-0 relative overflow-hidden'>
      <div className='absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/20 blur-[120px] rounded-full' />
      <button
        onClick={() => setIsDetailModalOpen(false)}
        className='absolute z-100 top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors'
      >
        <X size={20} />
      </button>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10'>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <span className='px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black tracking-[0.2em] text-primary uppercase'>
              {project.code}
            </span>
            <div className='h-1 w-1 rounded-full bg-slate-600' />
            <div className='flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider'>
              <Calendar size={12} className='text-primary/60' />
              <span>
                {project.startDate ? formatDateCzech(project.startDate) : '---'}
                <span className='mx-2 opacity-30'>|</span>
                {status === 'finished'
                  ? formatDateCzech(project.endDate)
                  : 'In Progress'}
              </span>
            </div>
          </div>

          <h2 className='text-2xl md:text-4xl font-black tracking-tight leading-tight uppercase'>
            {getVNProjectName(project) || 'Untitled Project'}
          </h2>
        </div>

        {/* Action Group */}
        <div className='flex items-center gap-3'>
          {isUpdating ? (
            <div className='flex items-center gap-2 px-6 py-2.5 text-slate-400 italic text-[10px] uppercase font-black'>
              <Loader2 className='animate-spin' size={14} />
              Processing...
            </div>
          ) : (
            <>
              {status === 'processing' && (
                <>
                  <ActionButton
                    variant='success'
                    icon={<Play size={14} fill='currentColor' />}
                    label='Bắt đầu'
                    onClick={() => handleUpdateStatus('started')}
                  />
                  <ActionButton
                    variant='danger'
                    icon={<XCircle size={14} />}
                    label='Hủy bỏ'
                    onClick={() => handleUpdateStatus('cancelled')}
                  />
                </>
              )}

              {status === 'started' && (
                <>
                  <ActionButton
                    variant='blue'
                    icon={<CheckCircle2 size={14} />}
                    label='Kết thúc'
                    onClick={() => handleUpdateStatus('finished')}
                  />
                  <ActionButton
                    variant='danger'
                    icon={<XCircle size={14} />}
                    label='Hủy bỏ'
                    onClick={() => handleUpdateStatus('cancelled')}
                  />
                </>
              )}
            </>
          )}

          {/* Badges cho trạng thái cuối */}
          {status === 'finished' && (
            <div className='flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/20'>
              <ShieldCheck size={16} className='animate-pulse' />
              <span className='text-[10px] font-black uppercase tracking-[0.15em]'>
                Project Completed
              </span>
            </div>
          )}

          {status === 'cancelled' && (
            <div className='flex items-center gap-3 px-5 py-2.5 bg-rose-500/5 text-rose-400 rounded-xl border border-rose-500/20'>
              <Ban size={16} />
              <span className='text-[10px] font-black uppercase tracking-[0.15em]'>
                Project Cancelled
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderSection
