import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'

const InfoTile = ({ label, value, color }: any) => (
  <div>
    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>
      {label}
    </p>
    <p
      className={cn(
        'text-md font-bold',
        color === 'orange'
          ? 'text-orange-600'
          : color === 'emerald'
            ? 'text-emerald-600'
            : 'text-sky-800',
      )}
    >
      {formatCurrency(value)}
    </p>
  </div>
)

export default InfoTile
