import { Filter, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message?: string
  description?: string
  type?: 'filter' | 'search' | 'empty'
  className?: string
  icon?: React.ReactNode
}

const EmptyState = ({
  message = 'Không tìm thấy dữ liệu phù hợp',
  description,
  type = 'filter',
  className,
  icon,
}: EmptyStateProps) => {
  // Tự động chọn icon dựa trên type nếu người dùng không truyền icon riêng
  const defaultIcon = {
    filter: <Filter size={48} strokeWidth={1.5} className='text-slate-300' />,
    search: <SearchX size={48} strokeWidth={1.5} className='text-slate-300' />,
    empty: (
      <div className='w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold italic'>
        !
      </div>
    ),
  }

  return (
    <div
      className={cn(
        'bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[40px]',
        'h-72 flex flex-col items-center justify-center text-slate-400 p-8 text-center transition-all',
        className,
      )}
    >
      <div className='mb-4 p-4 bg-white rounded-full shadow-sm border border-slate-100'>
        {icon || defaultIcon[type]}
      </div>

      <div className='space-y-1'>
        <p className='font-black text-slate-500 text-sm tracking-tight uppercase'>
          {message}
        </p>
        {description && (
          <p className='text-xs text-slate-400 max-w-[200px] leading-relaxed'>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default EmptyState
