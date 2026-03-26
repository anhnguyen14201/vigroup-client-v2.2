'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { ItemCounter } from '@/components/shared'
import { useMaterialContext } from '../hooks' // Giả định hook của Anh
import DateFilter from '@/components/shared/DateFilter'

// 1. Config cho Nhóm hóa đơn (invoiceGroup)
const groupLabels: Record<string, string> = {
  all: 'Tất cả nhóm',
  materials: 'Vật tư',
  fuel: 'Xăng dầu',
  otherExpenses: 'Chi phí khác',
}

const groupStyles: Record<string, string> = {
  materials: 'text-blue-600 border-blue-200 bg-blue-50/50',
  fuel: 'text-amber-600 border-amber-200 bg-amber-50/50',
  otherExpenses: 'text-purple-600 border-purple-200 bg-purple-50/50',
}

// 2. Config cho Hình thức thanh toán (paymentMethod)
const paymentLabels: Record<string, string> = {
  all: 'Tất cả thanh toán',
  cash: 'Tiền mặt',
  bankTransfer: 'Chuyển khoản',
  onInvoice: 'Ghi nợ',
}

const paymentStyles: Record<string, string> = {
  cash: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
  bankTransfer: 'text-blue-600 border-blue-200 bg-blue-50/50',
  onInvoice: 'text-orange-600 border-orange-200 bg-orange-50/50',
}

const MaterialFilters = () => {
  const {
    invoices,
    totalItems,
    invoiceGroup,
    setInvoiceGroup,
    paymentMethod,
    setPaymentMethod,
    userId,
    setUserId,
    projIds,
    setProjIds,
    purchasePlace,
    setPurchasePlace,
    // Giả định Anh có list users và projects từ context để render select
    users,
    projects,
    places,
    day,
    month,
    year,
    setDateFilter,
  } = useMaterialContext()

  return (
    <div className='flex flex-wrap items-center gap-3 w-full'>
      <DateFilter
        day={day}
        month={month}
        year={year}
        onFilterChange={setDateFilter}
      />

      <Select value={projIds} onValueChange={setProjIds}>
        <SelectTrigger
          className='min-w-45 cursor-pointer rounded-full border border-slate-200 h-8 px-4 font-bold text-slate-600 
                    shadow-none focus:ring-offset-0 focus-visible:ring-0 outline-none focus:ring-0 transition-all 
                    hover:border-primary/50 bg-white'
        >
          <span className='truncate text-[11px] uppercase tracking-wider text-primary'>
            {projIds && projIds !== 'all'
              ? projects.find((p: any) => p._id === projIds)?.projectName
              : 'Dự Án'}
          </span>
        </SelectTrigger>
        <SelectContent
          position='popper'
          sideOffset={0}
          className='rounded-xl border-slate-100 z-100 bg-white shadow-lg min-w-45'
        >
          {' '}
          <SelectItem
            value='all'
            className='text-[11px] font-bold uppercase text-slate-400 focus:bg-slate-50 rounded-xl'
          >
            Tất cả dự án
          </SelectItem>
          {/* Render danh sách từ JSON của Nguyên */}
          {projects?.map((proj: any) => (
            <SelectItem
              key={proj._id}
              value={proj._id}
              className='text-xs font-medium cursor-pointer'
            >
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-slate-200' />
                <div className='flex flex-col gap-0.5'>
                  <span className='font-bold'>{proj.projectName}</span>
                  {/* Hiển thị thêm mã code nhỏ phía dưới cho "luxury" */}
                  <span className='text-[10px] opacity-50 font-medium'>
                    #{proj.code}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 5. Lọc theo Nơi mua (purchasePlace) */}
      <Select value={purchasePlace} onValueChange={setPurchasePlace}>
        <SelectTrigger
          className='min-w-45 cursor-pointer rounded-full border border-slate-200 h-8 px-4 font-bold text-slate-600 
               shadow-none focus:ring-offset-0 focus-visible:ring-0 outline-none focus:ring-0 transition-all 
               hover:border-primary/50 bg-white'
        >
          <span className='truncate text-[11px] uppercase tracking-wider text-primary'>
            {/* Vì purchasePlace lưu chính là tên chuỗi, nên hiển thị trực tiếp luôn */}
            {purchasePlace && purchasePlace !== 'all'
              ? purchasePlace
              : 'Nơi mua'}
          </span>
        </SelectTrigger>

        <SelectContent
          position='popper'
          sideOffset={4}
          className='rounded-xl border-slate-100 z-110 bg-white shadow-lg min-w-45 overflow-y-auto'
        >
          <SelectItem
            value='all'
            className='text-[11px] font-bold uppercase text-slate-400 focus:bg-slate-50 rounded-lg'
          >
            Tất cả địa điểm
          </SelectItem>

          {/* Render danh sách từ mảng string places của Anh */}
          {places?.map((place: string) => (
            <SelectItem
              key={place}
              value={place}
              className='text-xs font-medium cursor-pointer py-2 hover:bg-slate-50'
            >
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-slate-200' />
                <span className='font-bold text-slate-700 uppercase'>
                  {place}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 4. Lọc theo Nhân viên (userId) */}
      <Select value={userId} onValueChange={setUserId}>
        <SelectTrigger
          className='min-w-45 cursor-pointer rounded-full border border-slate-200 h-8 px-4 font-bold text-slate-600 
                    shadow-none focus:ring-offset-0 focus-visible:ring-0 outline-none focus:ring-0 transition-all 
                    hover:border-primary/50 bg-white'
        >
          <span className='truncate text-[11px] uppercase tracking-wider text-primary'>
            {userId && userId !== 'all'
              ? users.find((u: any) => u._id === userId)?.fullName
              : 'Người chi'}
          </span>
        </SelectTrigger>
        <SelectContent
          position='popper'
          sideOffset={0}
          className='rounded-xl border-slate-100 z-100 bg-white shadow-lg min-w-45'
        >
          {' '}
          <SelectItem
            value='all'
            className='text-[11px] font-bold uppercase text-slate-400 focus:bg-slate-50 rounded-xl'
          >
            {' '}
            Tất cả nhân viên
          </SelectItem>
          {users.map((user: any) => (
            <SelectItem
              key={user._id}
              value={user._id}
              className='text-xs font-medium cursor-pointer'
            >
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-slate-200' />
                <span className='font-bold'> {user.fullName}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={invoiceGroup} onValueChange={setInvoiceGroup}>
        <SelectTrigger
          className={`min-w-35 rounded-full border h-8 px-5 font-semibold 
                    shadow-none outline-none focus:ring-0 focus:ring-offset-0 
                    focus-visible:ring-0 cursor-pointer transition-all duration-200
                    ${groupStyles[invoiceGroup] || 'text-primary border-slate-200'}`}
        >
          <span className='text-[11px] uppercase font-bold'>
            {invoiceGroup && invoiceGroup !== 'all'
              ? groupLabels[invoiceGroup]
              : 'Nhóm hóa đơn'}
          </span>
        </SelectTrigger>
        <SelectContent
          position='popper'
          sideOffset={0}
          className='rounded-xl border-slate-100 z-100 bg-white shadow-lg min-w-45'
        >
          {' '}
          {Object.entries(groupLabels).map(([value, label]) => (
            <SelectItem
              key={value}
              value={value}
              className={`text-xs font-medium ${
                value === 'all'
                  ? 'text-slate-600'
                  : groupStyles[value]?.split(' ')[0]
              }`}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 2. Lọc theo Hình thức thanh toán */}
      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger
          className={`min-w-35 rounded-full border h-8 px-5 font-semibold 
                    shadow-none outline-none focus:ring-0 focus:ring-offset-0 
                    focus-visible:ring-0 cursor-pointer transition-all duration-200
                    ${paymentStyles[paymentMethod] || 'text-primary border-slate-200'}`}
        >
          <span className='text-[11px] uppercase font-bold'>
            {paymentMethod && paymentMethod !== 'all'
              ? paymentLabels[paymentMethod]
              : 'Thanh toán'}
          </span>
        </SelectTrigger>
        <SelectContent
          position='popper'
          sideOffset={0}
          className='rounded-xl border-slate-100 z-100 bg-white shadow-lg min-w-45'
        >
          {' '}
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

      {/* 5. Item Counter */}
      <div className='ml-auto'>
        <ItemCounter
          currentCount={invoices.length}
          totalCount={totalItems}
          label='hóa đơn'
        />
      </div>
    </div>
  )
}

export default MaterialFilters
