import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'

const OperationalCard = ({ icon, label, value, unit, subtext, color }: any) => {
  // Cập nhật Map để tách biệt màu nền/viền và màu chữ chính
  const colorStyles: any = {
    blue: {
      icon: 'text-blue-600 bg-blue-50 border-blue-100',
      text: 'text-blue-600',
    },
    orange: {
      icon: 'text-orange-600 bg-orange-50 border-orange-100',
      text: 'text-orange-600',
    },
    purple: {
      icon: 'text-purple-600 bg-purple-50 border-purple-100',
      text: 'text-purple-600',
    },
    emerald: {
      icon: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      text: 'text-emerald-600',
    },
  }

  const activeStyle = colorStyles[color] || colorStyles.blue

  return (
    <div
      className='p-6 bg-white rounded-4xl border border-slate-100 group 
                 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 
                 transition-all duration-300'
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border transition-transform group-hover:scale-110 duration-300',
          activeStyle.icon,
        )}
      >
        {icon}
      </div>

      <p
        className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] 
                  mb-1.5 group-hover:text-slate-600 transition-colors'
      >
        {label}
      </p>

      <div className='flex items-baseline gap-1 mb-1'>
        <p
          className={cn(
            'text-xl font-black tracking-tight transition-colors',
            activeStyle.text,
          )}
        >
          {/* Nếu là tiền (color là blue/orange) thì format, nếu là số thường thì giữ nguyên */}
          {typeof value === 'number' && (color === 'blue' || color === 'orange')
            ? value.toLocaleString()
            : value}
        </p>

        {unit && (
          <span
            className={cn(
              'text-sm font-bold uppercase opacity-80',
              activeStyle.text,
            )}
          >
            {unit}
          </span>
        )}
      </div>

      <p
        className='text-[11px] font-bold text-slate-400 italic bg-slate-50
                  w-fit px-2.5 py-0.5 rounded-full'
      >
        {subtext}
      </p>
    </div>
  )
}

export default OperationalCard
