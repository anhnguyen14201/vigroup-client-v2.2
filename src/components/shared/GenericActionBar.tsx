import { Button, Input } from '@/components/ui'
import { Search, LucideIcon, Plus } from 'lucide-react'

interface GenericActionBarProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  placeholder?: string
  buttonLabel: string
  buttonIcon?: LucideIcon
  onButtonClick: () => void
  disabled?: boolean
}

export const GenericActionBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Tìm kiếm...',
  buttonLabel,
  buttonIcon: ButtonIcon = Plus, // Mặc định là icon Plus nếu không truyền
  onButtonClick,
  disabled = false,
}: GenericActionBarProps) => {
  return (
    <div className='max-w-7xl mx-auto w-full mb-6'>
      <div className='flex flex-col md:flex-row items-center gap-4 bg-slate-50/80 p-0.75 rounded-2xl md:rounded-full border'>
        {/* Search Input Group */}
        <div className='relative flex-1 group w-full'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors'
            size={18}
          />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className='h-11 pl-12 pr-4 border-none rounded-full focus-visible:ring-0 bg-transparent text-sm font-medium w-full shadow-none'
          />
        </div>

        {/* Action Button */}
        <Button
          disabled={disabled}
          onClick={onButtonClick}
          className='hidden md:flex h-11 w-auto px-8 cursor-pointer rounded-full font-bold text-[11px] tracking-widest uppercase transition-all items-center justify-center gap-2 bg-primary text-white hover:opacity-90 active:scale-95 disabled:opacity-50'
        >
          <ButtonIcon size={18} strokeWidth={2.5} />
          <span className='whitespace-nowrap'>{buttonLabel}</span>
        </Button>
      </div>
    </div>
  )
}

export default GenericActionBar
