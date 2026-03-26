'use client'

import React, { useMemo } from 'react'
import { CalendarDays } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components'

interface DateFilterProps {
  day: string | number
  month: string | number
  year: string | number
  onFilterChange: (
    day: string | number,
    month: number, // Đổi ở đây
    year: number,
  ) => void
  className?: string
  startYear?: number // Cho phép tùy chỉnh năm bắt đầu nếu cần
}

const DateFilter = ({
  day,
  month,
  year,
  onFilterChange,
  className = '',
  startYear = 2025,
}: DateFilterProps) => {
  // Tự khởi tạo danh sách ngày, tháng, năm bên trong component
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), [])
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1
    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i,
    ).reverse()
  }, [startYear])

  return (
    <div
      className={`flex items-center gap-2 px-2 bg-white rounded-full border ${className}`}
    >
      <CalendarDays size={16} className='ml-2 text-primary' />

      <div className='flex items-center gap-1'>
        {/* Ngày */}
        <Select
          value={day.toString()}
          onValueChange={val =>
            onFilterChange(val, Number(month), Number(year))
          }
        >
          <SelectTrigger
            className='h-8 w-17.5 cursor-pointer border-none bg-transparent font-bold 
                        text-xs shadow-none focus:ring-0 focus:ring-offset-0 
                        focus:outline-none focus-visible:ring-0 focus-visible:outline-none'
          >
            {' '}
            <SelectValue placeholder='Ngày' />
          </SelectTrigger>
          <SelectContent
            position='popper'
            sideOffset={0}
            className='rounded-xl border-slate-100 z-10000 bg-white'
          >
            {' '}
            <SelectItem value='all' className='text-xs font-bold text-primary'>
              Tất cả
            </SelectItem>
            {days.map(d => (
              <SelectItem key={d} value={d.toString()} className='text-xs'>
                {d < 10 ? `0${d}` : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className='text-slate-300 font-light'>/</span>

        {/* Tháng */}
        <Select
          value={month.toString()}
          onValueChange={val => onFilterChange(day, Number(val), Number(year))}
        >
          <SelectTrigger
            className='h-8 w-27.5 cursor-pointer border-none bg-transparent font-bold 
                        text-xs shadow-none focus:ring-0 focus:ring-offset-0 
                        focus:outline-none focus-visible:ring-0 focus-visible:outline-none'
          >
            {' '}
            <SelectValue placeholder='Tháng' />
          </SelectTrigger>
          <SelectContent
            position='popper'
            sideOffset={0}
            className='rounded-xl border-slate-100 z-10000 bg-white'
          >
            {' '}
            {months.map(m => (
              <SelectItem
                key={m}
                value={m.toString()}
                className='text-xs font-medium'
              >
                Tháng {m < 10 ? `0${m}` : m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className='text-slate-300 font-light'>/</span>

        {/* Năm */}
        <Select
          value={year.toString()}
          onValueChange={val => onFilterChange(day, Number(month), Number(val))}
        >
          <SelectTrigger
            className='h-8 w-21.25 cursor-pointer border-none bg-transparent font-bold 
                        text-xs shadow-none focus:ring-0 focus:ring-offset-0 
                        focus:outline-none focus-visible:ring-0 focus-visible:outline-none'
          >
            <SelectValue placeholder='Năm' />
          </SelectTrigger>
          <SelectContent
            position='popper'
            sideOffset={0}
            className='rounded-xl border-slate-100 z-10000 bg-white'
          >
            {' '}
            {years.map(y => (
              <SelectItem
                key={y}
                value={y.toString()}
                className='text-xs font-medium'
              >
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default DateFilter
