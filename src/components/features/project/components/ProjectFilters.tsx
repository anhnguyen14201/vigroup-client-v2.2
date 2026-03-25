import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select' // Đường dẫn tới shadcn select của bạn
import { ItemCounter } from '@/components/shared'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'

// 1. Khai báo các config hiển thị (Nên để ngoài component để tránh render lại)
const statusLabels: Record<string, string> = {
  all: 'Tất cả tiến độ',
  processing: 'Chờ xử lý',
  started: 'Đã bắt đầu',
  finished: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const statusStyles: Record<string, string> = {
  processing: 'text-amber-600 border-amber-200 bg-amber-50/50',
  started: 'text-blue-600 border-blue-200 bg-blue-50/50',
  finished: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
  cancelled: 'text-rose-600 border-rose-200 bg-rose-50/50',
}

const paymentLabels: Record<string, string> = {
  all: 'Tất cả thanh toán',
  unpaid: 'Chưa thanh toán',
  deposited: 'Đã đặt cọc',
  partial: 'Thanh toán một phần',
  paid: 'Đã thanh toán',
  processing: 'Chờ xử lý',
}

const paymentStyles: Record<string, string> = {
  unpaid: 'text-rose-600 border-rose-200 bg-rose-50/50',
  deposited: 'text-amber-500 border-amber-200 bg-amber-50/50',
  partial: 'text-indigo-500 border-indigo-200 bg-indigo-50/50',
  paid: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
}

const ProjectFilters = () => {
  const {
    totalItems,
    projectsData,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
  } = useProjectContext()
  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full'>
      {' '}
      {/* Filter Trạng thái công trình */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger
          className={`min-w-35 rounded-full border h-8 px-5 font-semibold 
                     shadow-none outline-none focus:ring-0 focus:ring-offset-0 
                     focus-visible:ring-0 cursor-pointer transition-all duration-200
                     ${statusStyles[status] || 'text-primary border-slate-200'}`}
        >
          <span className='truncate text-xs'>
            {status && status !== 'all' ? statusLabels[status] : 'Tiến độ'}
          </span>
        </SelectTrigger>

        <SelectContent
          position='popper'
          sideOffset={4}
          className='rounded-xl border-slate-100 z-100 bg-white shadow-lg min-w-45'
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <SelectItem
              key={value}
              value={value}
              className={`text-xs font-medium ${
                value === 'all'
                  ? 'text-slate-600'
                  : statusStyles[value]?.split(' ')[0]
              }`}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Filter Trạng thái thanh toán */}
      <Select value={paymentStatus} onValueChange={setPaymentStatus}>
        <SelectTrigger
          className={`min-w-35 rounded-full border h-8 px-5 font-semibold 
                     shadow-none outline-none focus:ring-0 focus:ring-offset-0 
                     focus-visible:ring-0 cursor-pointer transition-all duration-200
                     ${paymentStyles[paymentStatus] || 'text-slate-600 border-slate-200'}`}
        >
          <span className='truncate text-xs'>
            {paymentStatus && paymentStatus !== 'all'
              ? paymentLabels[paymentStatus]
              : 'Thanh toán'}
          </span>
        </SelectTrigger>

        <SelectContent
          position='popper'
          sideOffset={4}
          className='rounded-xl border-slate-100 z-100 bg-white shadow-lg min-w-45'
        >
          {Object.entries(paymentLabels).map(([value, label]) => (
            <SelectItem
              key={value}
              value={value}
              className={`text-xs font-medium ${
                value === 'all'
                  ? 'text-slate-600'
                  : paymentStyles[value]?.split(' ')[0]
              }`}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Badge hiển thị tổng số */}
      <div className=''>
        <ItemCounter
          currentCount={projectsData.length}
          totalCount={totalItems}
          className='ml-auto' // Đẩy sang bên phải nếu nằm trong flex container
        />
      </div>
    </div>
  )
}

export default ProjectFilters
