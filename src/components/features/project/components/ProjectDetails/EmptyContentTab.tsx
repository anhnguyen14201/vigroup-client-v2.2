import { TabsContent } from '@/components/ui'
import React from 'react'

const EmptyContentTab = ({ value, icon, text }: any) => (
  <TabsContent
    value={value}
    className='m-0 animate-in fade-in slide-in-from-bottom-2'
  >
    <div className='bg-white p-8 rounded-4xl border border-slate-200 min-h-[400px] flex items-center justify-center text-slate-400'>
      <div className='text-center'>
        <div className='opacity-20 flex justify-center mb-4'>{icon}</div>
        <p>{text}</p>
      </div>
    </div>
  </TabsContent>
)

export default EmptyContentTab
