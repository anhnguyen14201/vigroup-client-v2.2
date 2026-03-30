import { motion, AnimatePresence } from 'framer-motion'
import { Check, Edit3, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

const FilterSection = ({
  label,
  options,
  value,
  onChange,
  onAdd,
  onEdit, // Thêm prop onEdit
  onDelete, // Thêm prop onDelete
  defaultOpen = false,
}: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [localSearch, setLocalSearch] = useState('')

  const filteredOptions = useMemo(() => {
    if (!localSearch) return options
    return options.filter((opt: any) =>
      opt.name?.toLowerCase().includes(localSearch.toLowerCase()),
    )
  }, [options, localSearch])

  return (
    <div className='border-b border-slate-50 pb-2 last:border-none'>
      <div className='flex justify-between items-center py-2 px-1 group/label '>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-1 text-left text-[10px] cursor-pointer font-black uppercase tracking-[0.15em] transition-colors ${
            isOpen
              ? 'text-primary'
              : 'text-slate-400 group-hover/label:text-slate-600'
          }`}
        >
          {label} {value && <span className='ml-2 text-primary'>(1)</span>}
        </button>

        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={onAdd}
          className='p-1 bg-primary/10 rounded-md cursor-pointer hover:bg-priamry/20 transition-colors'
        >
          <Plus size={14} className='text-primary' strokeWidth={3} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='overflow-hidden'
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            {/* ... ô Search giữ nguyên ... */}
            <div className='flex flex-col gap-1 max-h-120 overflow-y-auto pr-1 no-scrollbar py-1'>
              {filteredOptions.map((opt: any) => (
                <div key={opt.id} className='relative group/item'>
                  <button
                    onClick={() => onChange(value === opt.id ? '' : opt.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-[11px] font-bold uppercase transition-all ${
                      value === opt.id
                        ? 'bg-primary text-white'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                    // Thêm style thụt lề dựa trên level
                    style={{
                      paddingLeft: opt.level
                        ? `${opt.level * 12 + 12}px`
                        : '12px',
                    }}
                  >
                    <div className='flex items-center gap-2 truncate pr-8'>
                      {/* Nếu là cấp con, thêm icon nhỏ để nhận diện */}
                      {opt.level > 0 && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${value === opt.id ? 'bg-indigo-300' : 'bg-slate-200'}`}
                        />
                      )}
                      <span className='truncate'>{opt.name}</span>
                    </div>
                    {value === opt.id && <Check size={12} strokeWidth={4} />}
                  </button>

                  {/* Nút Sửa/Xóa hiện khi hover */}
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all'>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onEdit?.(opt)
                      }}
                      className='bg-white p-1 rounded-full text-slate-400 
                                hover:text-emerald-600 hover:bg-emerald-200 cursor-pointer'
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onDelete?.(opt)
                      }}
                      className='p-1 bg-white rounded-full text-slate-400 
                                hover:text-rose-500 hover:bg-rose-200 cursor-pointer'
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterSection
