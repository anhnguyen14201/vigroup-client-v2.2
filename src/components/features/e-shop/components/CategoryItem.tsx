import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

const CategoryItem = ({
  item,
  isSelected,
  onToggle,
  activeLang,
  getTranslation,
  variant = 'primary',
}: any) => {
  const translation = getTranslation(item, activeLang)
  const name = translation?.name || item?.name || 'N/A'

  // Định nghĩa màu sắc Luxury dựa trên variant
  const styles = {
    primary: {
      active: 'text-primary',
      check: 'bg-primary border-transparent text-white',
      hover: 'hover:text-primary',
    },
    secondary: {
      active: 'text-primary',
      check: 'bg-primary border-transparent text-white',
      hover: 'hover:text-primary',
    },
  } as any

  const currentStyle = styles[variant]

  return (
    <motion.div
      onClick={onToggle}
      className={`
        group relative flex items-center gap-3 cursor-pointer transition-all 
        ${
          isSelected
            ? currentStyle.active
            : `border-slate-100 text-slate-600 ${currentStyle.hover}`
        }
      `}
    >
      {/* Checkbox Icon */}
      <div
        className={`
          shrink-0 w-5 h-5 rounded-full flex items-center justify-center border 
          transition-all 
          ${isSelected ? currentStyle.check : ' group-hover:border-slate-300'}
        `}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Check size={12} strokeWidth={4} />
          </motion.div>
        )}
      </div>

      {/* Text Content */}
      <div className='flex flex-col min-w-0 flex-1'>
        <span
          className={`
            text-[11px] leading-tight transition-colors uppercase
            ${isSelected ? 'font-black' : 'font-bold'}
          `}
        >
          {name}
        </span>
      </div>
    </motion.div>
  )
}

export default CategoryItem
