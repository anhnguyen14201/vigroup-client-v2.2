import React from 'react'
import { cn } from '@/lib/utils'

interface ItemCounterProps {
  currentCount: number
  totalCount: number
  label?: string
  className?: string
  showPing?: boolean
}

const ItemCounter = ({
  currentCount,
  totalCount,
  label = 'dự án',
  className,
  showPing = true,
}: ItemCounterProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 h-7 rounded-full justify-start bg-primary/10 border border-primary/20 transition-all duration-300',
        className,
      )}
    >
      {/* Hiệu ứng chấm tròn nhấp nháy (Ping Animation) */}
      {showPing && (
        <span className='relative flex h-2 w-2'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
          <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
        </span>
      )}

      {/* Nội dung số lượng */}
      <span className='text-primary uppercase text-[10px] font-black tracking-tight whitespace-nowrap'>
        {currentCount.toLocaleString()}
        <span className='opacity-60 font-medium mx-1'>/</span>
        {totalCount.toLocaleString()} {label}
      </span>
    </div>
  )
}

export default ItemCounter
