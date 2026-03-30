'use client'

import { motion } from 'framer-motion'
import { FolderPlus, Globe, MoreHorizontal, ShieldCheck } from 'lucide-react'

const BrandManager = () => {
  const brands = [
    {
      id: 1,
      name: 'Leica Geosystems',
      country: 'Thụy Sĩ',
      products: 42,
      logo: 'L',
    },
    { id: 2, name: 'Topcon', country: 'Nhật Bản', products: 28, logo: 'T' },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {brands.map((brand, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={brand.id}
          className='bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group'
        >
          <div className='absolute top-0 right-0 p-6'>
            <MoreHorizontal className='text-slate-300 cursor-pointer hover:text-slate-900 transition-colors' />
          </div>

          <div className='w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-xl shadow-slate-200'>
            {brand.logo}
          </div>

          <h3 className='text-xl font-black text-slate-800 mb-1 flex items-center gap-2'>
            {brand.name}
            <ShieldCheck size={18} className='text-blue-500' />
          </h3>

          <div className='flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-6'>
            <Globe size={14} /> {brand.country}
          </div>

          <div className='pt-6 border-t border-slate-50 flex justify-between items-center'>
            <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
              Tổng sản phẩm
            </span>
            <span className='text-lg font-mono font-black text-slate-900'>
              {brand.products}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Nút thêm Brand nhanh */}
      <div className='border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group'>
        <div className='w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors'>
          <FolderPlus size={24} />
        </div>
        <span className='font-bold text-slate-400 group-hover:text-indigo-600'>
          Thêm đối tác mới
        </span>
      </div>
    </div>
  )
}

export default BrandManager
