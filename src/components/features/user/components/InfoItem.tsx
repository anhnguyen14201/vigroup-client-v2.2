import React from 'react'

const InfoItem = ({ icon, label, value, highlight }: any) => (
  <div className='flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors'>
    <div className='mt-1 text-slate-400'>
      {React.cloneElement(icon, { size: 20, strokeWidth: 1.5 })}
    </div>
    <div>
      <p className='text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5'>
        {label}
      </p>
      <p
        className={`font-bold text-slate-800 ${highlight ? 'text-indigo-600' : ''}`}
      >
        {value}
      </p>
    </div>
  </div>
)

export default InfoItem
