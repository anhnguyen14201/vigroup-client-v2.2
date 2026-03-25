import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils' // Nếu bạn dùng shadcn hoặc có hàm cn
import { motion } from 'framer-motion'
interface LoadingStateProps {
  message?: string
  className?: string
  iconClassName?: string
}

const LoadingState = ({
  message = 'Đang tải dữ liệu...',
  className,
  iconClassName,
}: LoadingStateProps) => {
  const brandColor = '#c74242'
  return (
    <div
      className={cn(
        'h-64 flex flex-col items-center justify-center text-primary transition-all duration-300',
        className,
      )}
    >
      <div className='relative flex items-center justify-center'>
        {/* Vòng xoay chính */}
        <div className='relative w-20 h-20 flex items-center justify-center'>
          {/* Spinner: Xoay quanh logo */}
          <div className='absolute inset-0 rounded-full border-t-3 border-b-3                       border-primary animate-spin'></div>

          {/* Logo: Căn giữa tuyệt đối trong vòng tròn */}
          <div className='flex items-center justify-center p-4'></div>
        </div>

        {/* Hiệu ứng bóng mờ nhẹ phía sau (tùy chọn để đẹp hơn) */}
        <div className='absolute inset-0 w-10 h-10 bg-primary/10 blur-xl rounded-full animate-pulse' />
      </div>

      <div className='flex flex-col items-center gap-2 mt-10'>
        <p
          className='text-xs font-semibold uppercase tracking-[0.4em] animate-pulse'
          style={{ color: brandColor }}
        >
          {message}
        </p>
        <div className='w-40 h-0.5 bg-slate-100 rounded-full overflow-hidden'>
          <motion.div
            className='h-full bg-primary'
            style={{ backgroundColor: brandColor }}
            animate={{ x: [-50, 50] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingState
