import { LucideIcon } from 'lucide-react'
import React, { memo } from 'react'

const SectionTitle = memo(
  ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
    <div className='flex items-center gap-2 pb-3 border-b border-slate-100'>
      <Icon size={16} className='text-indigo-600' />
      <span className='text-[11px] font-black text-slate-900 uppercase tracking-widest'>
        {title}
      </span>
    </div>
  ),
)

export default SectionTitle
