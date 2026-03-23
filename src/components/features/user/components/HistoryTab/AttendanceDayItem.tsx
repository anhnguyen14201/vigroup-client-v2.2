import { Calendar } from 'lucide-react'
import { formatCurrency, formatTimeCzech } from '@/utils'

interface AttendanceDayItemProps {
  dayItem: any
  handleEditShift: (recordId: string, shift: any, e: React.MouseEvent) => void
}

const AttendanceDayItem = ({
  dayItem,
  handleEditShift,
}: AttendanceDayItemProps) => {
  const dateObj = new Date(dayItem.date)
  const isToday = dateObj.toDateString() === new Date().toDateString()

  const weekdayVn = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' })
  const dateCzech = dateObj.toLocaleString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Prague',
  })

  return (
    <div className='bg-white border rounded-4xl overflow-hidden transition-all border-l-4 border-l-primary'>
      <div className='bg-slate-50/50 px-6 py-2 border-b border-slate-50 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-white rounded-xl'>
            <Calendar size={18} className='text-indigo-500' />
          </div>
          <div className='flex flex-col'>
            <p className='text-[11px] font-black text-slate-700'>
              <span className='capitalize'>{weekdayVn}</span>, {dateCzech}
            </p>
            <span className='text-[10px] font-black text-slate-800'>
              {dayItem.totalHours} Giờ
            </span>
          </div>
        </div>
        <div className='text-right'>
          <span className='font-black text-primary'>
            {formatCurrency(dayItem.salary)}
          </span>
        </div>
      </div>

      <div className='p-2 space-y-3'>
        {dayItem.shifts.map((shift: any) => {
          const isTravel = shift.type === 'travel'
          const actualIn = formatTimeCzech(shift.deviceTimeCheckIn)
          const actualOut = formatTimeCzech(shift.deviceTimeCheckOut)
          const calcIn = formatTimeCzech(shift.checkIn)
          const calcOut = formatTimeCzech(shift.checkOut)

          const getStatusBadge = () => {
            if (isTravel) {
              return !shift.deviceTimeCheckOut
                ? {
                    label: 'DI CHUYỂN',
                    class: 'bg-blue-100 text-blue-600 animate-pulse',
                  }
                : { label: 'GPS AUTO', class: 'bg-blue-50 text-blue-500' }
            }
            if (!shift.checkOut) {
              return isToday
                ? {
                    label: 'ĐANG LÀM VIỆC',
                    class: 'bg-amber-100 text-amber-600 animate-pulse',
                  }
                : {
                    label: 'QUÊN CHẤM CÔNG',
                    class: 'bg-rose-100 text-rose-600',
                  }
            }
            return {
              label: 'HOÀN THÀNH',
              class: 'bg-emerald-100 text-emerald-600',
            }
          }
          const badge = getStatusBadge()

          return (
            <div
              key={shift._id}
              onClick={e => handleEditShift(dayItem._id, shift, e)}
              className={`relative pl-8 border-l-2 ml-2 hover:border-[#C74242] cursor-pointer transition-all group/shift ${isTravel ? 'border-blue-200' : 'border-slate-100'}`}
            >
              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between'>
                  <h4
                    className={`font-black text-[11px] uppercase ${isTravel ? 'text-blue-600' : 'text-slate-800'}`}
                  >
                    {isTravel
                      ? 'Di chuyển hệ thống'
                      : shift.projectId?.projectName || 'Dự án không xác định'}
                  </h4>
                  <span
                    className={`text-[9px] font-black px-2 py-1 rounded-full transition-all ${badge.class}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {isTravel ? (
                  <div className='rounded-2xl flex items-center justify-between text-blue-700 font-black text-xs'>
                    <div className='flex items-center gap-4'>
                      <p>{calcIn || '--:--'}</p>{' '}
                      <span className='text-indigo-200'>→</span>{' '}
                      <p>{calcOut || '--:--'}</p>
                    </div>
                    <p>{shift.totalShiftHours}h</p>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <div className='bg-slate-50/80 px-5 py-1 rounded-2xl border border-slate-100 text-[11px]'>
                        <p className='text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1'>
                          Thực tế thiết bị
                        </p>
                        <div className='flex items-center justify-between font-bold'>
                          <span>{actualIn || '--:--'}</span>{' '}
                          <span className='text-indigo-200'>→</span>
                          <span
                            className={
                              actualOut
                                ? 'text-slate-900'
                                : isToday
                                  ? 'text-amber-500'
                                  : 'text-rose-500'
                            }
                          >
                            {actualOut || '--:--'}
                          </span>
                        </div>
                      </div>
                      <div className='bg-indigo-50/50 px-5 py-1 rounded-2xl border border-indigo-100 text-[11px] text-indigo-700 font-bold'>
                        <p className='text-[9px] font-bold text-indigo-400 uppercase'>
                          Giờ tính lương
                        </p>
                        <div className='flex items-center justify-between'>
                          <span>Từ: {calcIn || '--:--'}</span>{' '}
                          <span className='text-indigo-200'>→</span>{' '}
                          <span>Đến: {calcOut || '--:--'}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-4 bg-white rounded-2xl border-slate-100 italic text-slate-500 text-[9px] font-bold uppercase'>
                      <div className='flex-1 flex justify-around border-r border-slate-100 py-1'>
                        <p>
                          Ngày:{' '}
                          <span className='text-slate-800 text-xs'>
                            {shift.dayHours} h
                          </span>
                        </p>
                        <p className='text-rose-600'>
                          Đêm:{' '}
                          <span className='text-xs'>{shift.nightHours} h</span>
                        </p>
                        <p>
                          Tổng:{' '}
                          <span className='text-slate-800 text-xs'>
                            {shift.totalShiftHours} h
                          </span>
                        </p>
                        <p>
                          Thành tiền:{' '}
                          <span className='text-indigo-600 text-[11px] font-black'>
                            {shift.salaryForShift > 0
                              ? formatCurrency(shift.salaryForShift)
                              : '--'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {shift.notes && (
                  <div className='text-[10px] text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100 italic'>
                    <span className='font-bold not-italic text-slate-400'>
                      📝 Ghi chú:
                    </span>{' '}
                    {shift.notes}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AttendanceDayItem
