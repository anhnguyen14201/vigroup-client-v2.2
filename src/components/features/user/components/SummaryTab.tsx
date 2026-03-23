import { Zap, Smartphone, CreditCard, Calendar, Mail } from 'lucide-react'
import InfoItem from './InfoItem'
import { formatCurrency, formatDateCzech, formatPhone } from '@/utils'

const SummaryTab = ({ user }: any) => {
  console.log(user)
  return (
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <header>
        <h3 className='text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3 uppercase'>
          <Zap className='text-amber-400 fill-amber-400' size={28} />
          Tổng quan hồ sơ
        </h3>
        <p className='text-slate-400 text-sm mt-1 font-medium'>
          Quản lý thông tin chi tiết và định danh nhân sự
        </p>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
        <InfoItem
          icon={<Smartphone />}
          label='Số điện thoại'
          value={formatPhone(user.phone)}
        />
        <InfoItem
          icon={<CreditCard />}
          label='Lương/Giờ'
          value={formatCurrency(user.hourlyRate)}
          highlight
        />
        <InfoItem icon={<Mail />} label='email' value={user.email} />
        <InfoItem
          icon={<Calendar />}
          label='Ngày tham gia'
          value={formatDateCzech(user.createdAt)}
        />
      </div>

      <div className='bg-slate-900 rounded-4xl p-6 md:p-8 text-white relative overflow-hidden'>
        <div className='relative z-10'>
          <p className='text-indigo-300 text-[10px] font-black uppercase tracking-[2px] mb-3'>
            Hiệu suất tháng này
          </p>
          <p className='text-lg md:text-xl font-medium leading-relaxed italic opacity-95'>
            "Nhân viên đã hoàn thành{' '}
            <span className='text-indigo-400 font-bold'>
              {user.totalWorkedDays} ngày
            </span>{' '}
            công. Trung bình làm việc{' '}
            <span className='text-indigo-400 font-bold'>
              {user.averageHoursPerDay}h/ngày
            </span>
            ."
          </p>
        </div>
        <div className='absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl' />
      </div>
    </div>
  )
}

export default SummaryTab
