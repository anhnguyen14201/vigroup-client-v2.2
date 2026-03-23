const StatBox = ({ label, value, unit, color }: any) => {
  const colorClasses: any = {
    indigo: 'border-indigo-100 text-indigo-600 bg-indigo-50/30',
    amber: 'border-amber-100 text-amber-600 bg-amber-50/30',
    emerald: 'border-emerald-100 text-emerald-600 bg-emerald-50/30',
  }
  return (
    <div
      className={`p-6 rounded-4xl border ${colorClasses[color]} flex flex-col items-center text-center`}
    >
      <p className='text-[10px] font-black uppercase tracking-widest opacity-70 mb-2'>
        {label}
      </p>
      <div className='flex items-baseline gap-1'>
        <span className='text-2xl font-black tracking-tight text-slate-800'>
          {value}
        </span>
        {unit && (
          <span className='text-[10px] font-bold text-slate-400 uppercase'>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatBox
