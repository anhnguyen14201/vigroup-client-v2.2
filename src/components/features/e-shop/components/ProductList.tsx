import { Filter, Plus, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ProductList = () => {
  return (
    <div className='space-y-6'>
      {/* Search & Filter Bar */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search
            className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <input
            type='text'
            placeholder='Tìm theo tên, SKU hoặc thương hiệu...'
            className='w-full h-14 pl-14 pr-6 rounded-full border-none bg-white shadow-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all'
          />
        </div>
        <button className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50'>
          <Filter size={20} className='text-slate-600' />
        </button>
      </div>

      {/* Grid Danh sách */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[1, 2, 3, 4].map(item => (
          <motion.div
            key={item}
            whileHover={{ y: -10 }}
            className='bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 group'
          >
            <div className='aspect-square bg-slate-50 rounded-[2rem] mb-4 overflow-hidden relative'>
              <div className='absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-600'>
                In Stock
              </div>
              {/* Image Placeholder */}
              <div className='w-full h-full flex items-center justify-center text-slate-200 uppercase font-black italic'>
                No Image
              </div>
            </div>

            <div className='px-2 space-y-1'>
              <p className='text-[10px] font-black text-indigo-500 uppercase tracking-widest'>
                Apple · iPhone
              </p>
              <h3 className='font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors'>
                iPhone 15 Pro Max
              </h3>
              <div className='flex justify-between items-center pt-2'>
                <span className='font-mono font-black text-xl text-slate-900'>
                  32,990,000đ
                </span>
                <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer'>
                  <Plus size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
