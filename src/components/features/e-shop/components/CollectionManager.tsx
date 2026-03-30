'use client'

import { Layers } from 'lucide-react'

const CollectionManager = () => {
  return (
    <div className='flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200'>
      <div className='w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6'>
        <Layers size={40} className='text-slate-300' />
      </div>
      <h3 className='text-2xl font-black text-slate-800 uppercase tracking-tight'>
        Dòng sản phẩm (Series)
      </h3>
      <p className='text-slate-400 font-medium max-w-xs text-center mt-2 italic'>
        Ví dụ: iPhone 15 là Dòng sản phẩm, nằm trong Thương hiệu Apple.
      </p>
      <button className='mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg'>
        Khởi tạo Series đầu tiên
      </button>
    </div>
  )
}

export default CollectionManager
