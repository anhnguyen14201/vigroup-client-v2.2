import React from 'react'
import { TrendingUp } from 'lucide-react'
import StatBox from './StatBox'
import ProgressBar from './ProgressBar'
import { formatCurrency } from '@/utils'

const FinanceTab = ({ user }: any) => (
  <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
    <h3 className='text-2xl md:text-3xl font-black text-slate-800 uppercase'>
      Báo cáo tài chính
    </h3>

    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
      <StatBox
        label='Thu nhập'
        value={formatCurrency(user.totalSalary)}
        color='indigo'
      />
      <StatBox
        label='Số giờ'
        value={user.totalHours}
        unit='Giờ'
        color='amber'
      />
      <StatBox
        label='Ngày công'
        value={user.totalWorkedDays}
        unit='Ngày'
        color='emerald'
      />
    </div>

    <div className='bg-slate-50 rounded-[2.5rem] p-6 md:p-8 border border-slate-100'>
      <div className='flex items-center gap-2 mb-8 font-black text-slate-800'>
        <TrendingUp size={20} className='text-indigo-500' /> CHỈ SỐ HOẠT ĐỘNG
      </div>
      <div className='space-y-6'>
        <ProgressBar
          label='Dự án tham gia'
          current={user.totalProjects}
          max={10}
          color='bg-indigo-600'
        />
        <ProgressBar
          label='Cường độ làm việc'
          current={user.averageHoursPerDay}
          max={12}
          unit='h/ngày'
          color='bg-emerald-500'
        />
      </div>
    </div>
  </div>
)

export default FinanceTab
