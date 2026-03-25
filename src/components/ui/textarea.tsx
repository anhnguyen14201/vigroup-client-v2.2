import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // Hiệu ứng focus chuẩn
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1',
        // Tùy chỉnh màu bôi đen (Selection) và con trỏ (Caret)
        'selection:bg-primary selection:text-primary-foreground caret-primary',
        // Hỗ trợ Dark mode và Validation
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        'field-sizing-content',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
