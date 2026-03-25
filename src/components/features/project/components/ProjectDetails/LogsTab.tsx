import { TabsContent } from '@/components/ui'
import { History } from 'lucide-react'
import React from 'react'

const LogsTab = () => (
  <TabsContent
    value='logs'
    className='m-0 animate-in fade-in slide-in-from-bottom-2'
  >
    <div className='bg-white p-8 rounded-4xl border border-slate-200 min-h-[400px]'>
      <div className='flex justify-between items-center mb-8'>
        <h3 className='text-xl font-black text-slate-800 uppercase tracking-tight'>
          Nhật ký thi công hằng ngày
        </h3>
        <button className='px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all'>
          + Viết nhật ký
        </button>
      </div>
      <div className='flex flex-col items-center justify-center py-20 text-slate-400'>
        <History size={48} className='mb-4 opacity-20' />
        <p className='font-medium'>
          Chưa có hoạt động nào được ghi nhận hôm nay
        </p>
      </div>
    </div>
  </TabsContent>
)

export default LogsTab
