import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface TabOption {
  id: string
  label: string
  icon?: LucideIcon
  activeColor?: string // Màu text khi active (tùy chọn)
}

interface TabSwitcherProps {
  options: TabOption[]
  activeTab: string
  onChange: (id: string) => void
}

const TabSwitcher = ({ options, activeTab, onChange }: TabSwitcherProps) => {
  return (
    <div className='flex p-1 bg-slate-200/50 backdrop-blur-sm rounded-full w-fit border border-white/50 relative'>
      {options.map(option => {
        const isActive = activeTab === option.id
        const Icon = option.icon

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-colors z-10 cursor-pointer ${
              isActive
                ? option.activeColor || 'text-primary'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {/* Background nổi lên khi active sử dụng Framer Motion */}
            {isActive && (
              <motion.div
                layoutId='activeTabBackground'
                className='absolute inset-0 bg-white rounded-full -z-10 shadow-sm'
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              />
            )}

            {Icon && <Icon size={16} />}
            <span className='uppercase'>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default TabSwitcher
