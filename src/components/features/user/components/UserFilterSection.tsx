import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, RotateCcw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components'
import DateFilter from '@/components/shared/DateFilter'
import { useUserContext } from '../hooks/UserManagementContext'

const UserFilterSection = () => {
  const {
    subTab,
    day,
    month,
    year,
    selectedRole,
    searchQuery,
    filteredRoles,
    setDateFilter,
    setSelectedRole,
    setSearchQuery,
    resetAllFilters,
  } = useUserContext()

  const isDefaultDate =
    day === 'all' &&
    month === new Date().getMonth() + 1 &&
    year === new Date().getFullYear()

  const isDefaultRole = selectedRole === 'all' || selectedRole === ''
  const isSearchEmpty = searchQuery === ''
  const shouldShowReset = !isSearchEmpty || !isDefaultRole || !isDefaultDate

  if (subTab !== 'staff' || filteredRoles.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-wrap items-center gap-3 bg-white/40 backdrop-blur-md p-2'
    >
      {/* 1. Bộ lọc Thời gian */}
      <DateFilter
        day={day}
        month={month}
        year={year}
        onFilterChange={setDateFilter}
      />

      {/* 2. Bộ lọc Chức vụ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='flex items-center gap-2 px-2 bg-white rounded-full border'
      >
        <Briefcase size={16} className='ml-1 text-primary' />
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className='h-8 min-w-35 cursor-pointer border-none bg-transparent font-bold text-xs shadow-none focus:ring-0 focus:outline-none'>
            <SelectValue placeholder='Chọn chức vụ' />
          </SelectTrigger>
          <SelectContent
            position='popper'
            sideOffset={5}
            className='rounded-xl border-slate-100 z-100 bg-white'
          >
            <SelectItem
              value='all'
              className='text-xs font-medium italic text-slate-400'
            >
              Tất cả chức vụ
            </SelectItem>
            {filteredRoles.map(([val, label]) => (
              <SelectItem
                key={val}
                value={val}
                className='text-xs font-semibold'
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* 3. Nút Xóa bộ lọc */}
      <AnimatePresence>
        {shouldShowReset && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetAllFilters}
            className='flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all uppercase tracking-tighter'
          >
            <motion.div
              whileHover={{ rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <RotateCcw size={14} />
            </motion.div>
            Xóa bộ lọc
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default UserFilterSection
