const ProgressBar = ({ label, current, max, unit, color }: any) => {
  const percent = Math.min((current / max) * 100, 100)
  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-end'>
        <span className='text-xs font-bold text-slate-500 uppercase tracking-tighter'>
          {label}
        </span>
        <span className='text-sm font-black text-slate-800'>
          {current} {unit}
        </span>
      </div>
      <div className='h-2 bg-slate-200 rounded-full overflow-hidden'>
        <div
          className={`h-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
