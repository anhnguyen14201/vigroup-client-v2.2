'use client'

import React, { useMemo } from 'react'
import {
  Edit2,
  Phone,
  Trash2,
  UserCircle,
  Mail,
  Coins,
  BadgeDollarSign,
  Clock,
  Briefcase,
  MapPin,
} from 'lucide-react'

import { formatCurrency, formatPhone } from '@/utils'

const UserCard = React.memo(
  ({ type, user, onEdit, onDelete, onDetail }: any) => {
    const isStaff = type === 'staff'

    // Trạng thái hoạt động dựa trên isBlock từ Schema
    const isActive = !user.isBlock

    const financialData = useMemo(() => {
      // Nếu là dữ liệu từ monthlySummary (có totalHours)
      if (user.totalHours !== undefined) {
        return {
          isHourly: true,
          totalHours: user.totalHours || 0,
          hourlyRate: user.hourlyRate || 0,
          totalWorkedDays: user.totalWorkedDays || 0,
          totalIncome: user.totalSalary || 0,
          totalProjects: user.totalProjects || 0,
          avgHours: user.averageHoursPerDay || 0,
        }
      }

      // Fallback cho dữ liệu cũ (nếu cần)
      return { isHourly: false, totalIncome: 0 }
    }, [user])


    return (
      <div
        className={`p-6 rounded-4xl border group relative transition-all duration-300
                  cursor-pointer hover:shadow-md h-full ${
                    isActive
                      ? 'bg-white hover:border-primary'
                      : 'bg-rose-50/50 border-rose-100 hover:border-rose-300'
                  }`}
        onClick={() => onDetail(user)}
      >
        <div className='flex justify-between items-start mb-4'>
          <div className='flex gap-4'>
            {/* Avatar Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center 
                        transition-all ${
                          isActive
                            ? isStaff
                              ? 'bg-primary text-white'
                              : 'bg-indigo-100 text-indigo-600'
                            : 'bg-rose-200 text-rose-600'
                        }`}
            >
              <UserCircle size={32} />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <h3
                  className={`text-md font-bold leading-tight uppercase truncate ${
                    isActive ? 'text-slate-800' : 'text-rose-900'
                  }`}
                >
                  {user.fullName}
                </h3>
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 border-white ${
                    isActive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>

              {/* Hiển thị Position hoặc Role Status */}
              <span
                className={`inline-block mt-1 text-[10px] font-black px-3 py-0.5 rounded-full 
                          uppercase tracking-wider transition-colors ${
                            !isActive
                              ? 'bg-rose-100 text-rose-700'
                              : isStaff
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-50 text-indigo-700'
                          }`}
              >
                {isActive
                  ? user.position ||
                    (() => {
                      // Quy đổi từ mã số role sang tên hiển thị
                      switch (Number(user.role)) {
                        case 3515:
                          return 'CEO'
                        case 1413914:
                          return 'Admin'
                        case 1311417518:
                          return 'Quản lý hệ thống'
                        case 5131612152555:
                          return 'Nhân viên'
                        case 19531852011825:
                          return 'Kế toán'
                        case 22125518:
                          return 'Nhân viên - vật tư'
                        case 23521311920518:
                          return 'Quản trị viên'
                        case 32119201513518:
                          return 'Khách hàng'
                        default:
                          return 'Thành viên'
                      }
                    })()
                  : 'Tài khoản bị khóa'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <button
              onClick={e => {
                e.stopPropagation()
                onEdit(user)
              }}
              className='p-2.5 bg-white hover:bg-primary hover:text-white rounded-xl 
                       text-emerald-500 border border-slate-100 transition-all cursor-pointer'
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onDelete(user.employeeId || user._id)
              }}
              className='p-2.5 bg-white hover:bg-rose-500 hover:text-white rounded-xl
                       text-rose-500 border border-slate-100 transition-all cursor-pointer'
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className='mb-2'>
          <div className='flex items-center gap-3'>
            <Phone
              size={14}
              className={isActive ? 'text-slate-400' : 'text-rose-300'}
            />
            <span
              className={`text-sm font-medium ${isActive ? 'text-slate-700' : 'text-rose-800/80'}`}
            >
              {formatPhone(user.phone)}
            </span>
          </div>
          {user.email && (
            <div className='flex items-center gap-3'>
              <Mail
                size={14}
                className={isActive ? 'text-slate-400' : 'text-rose-300'}
              />
              <span
                className={`text-sm font-medium truncate ${isActive ? 'text-slate-500' : 'text-rose-800/60'}`}
              >
                {user.email}
              </span>
            </div>
          )}

          {(user.street || user.province) && (
            <div className='flex items-center gap-3'>
              <MapPin
                size={14}
                className={isActive ? 'text-slate-400' : 'text-rose-300'}
              />
              <p
                className={`text-sm font-medium truncate ${isActive ? 'text-slate-500' : 'text-rose-800/60'}`}
              >
                {user.street}, {user.postalCode} {user.province}
              </p>
            </div>
          )}
        </div>

        {!isStaff && user.companyName && (
          <div
            className={`px-4 py-2 rounded-2xl border border-dashed ${
              isActive
                ? 'bg-indigo-50/30 border-indigo-100'
                : 'bg-rose-100/20 border-rose-100'
            }`}
          >
            {/* Tên công ty */}
            <div className='flex items-start gap-3'>
              <Briefcase size={14} className='mt-0.5 text-indigo-500' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold text-slate-700 truncate'>
                  {user.companyName || 'N/A'}
                </p>
              </div>
            </div>

            {/* ICO & DIC */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-tight'>
                  ICO:
                </p>
                <p className='text-sm font-mono font-bold text-slate-600'>
                  {user.ico || '---'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-tight'>
                  DIC:
                </p>
                <p className='text-sm font-mono font-bold text-slate-600'>
                  {user.dic || '---'}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <MapPin size={14} className='mt-0.5 text-indigo-500' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold italic text-slate-700 truncate'>
                  {user.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Phần tài chính cho nhân viên - Hiển thị theo Hourly Rate */}
        {isStaff && (
          <div
            className={`space-y-1 p-4 rounded-3xl border transition-colors ${
              isActive
                ? 'bg-slate-50/50 border-slate-100'
                : 'bg-rose-100/20 border-rose-100/50'
            }`}
          >
            {/* Hàng 1: Số ngày và số giờ */}
            <div
              className={`flex justify-between items-center ${isActive ? 'text-slate-500' : 'text-red-800/50'}`}
            >
              <div className='flex items-center gap-2'>
                <Clock size={14} className='text-blue-500' />
                <span className='text-[10px] font-bold uppercase tracking-tighter'>
                  Công: {financialData.totalWorkedDays} ngày
                </span>
              </div>
              <span className='text-xs font-bold'>
                {financialData.totalHours} giờ
              </span>
            </div>

            {/* Hàng 2: Lương giờ và Dự án */}
            <div
              className={`flex justify-between items-center ${isActive ? 'text-slate-500' : 'text-red-800/50'}`}
            >
              <div className='flex items-center gap-2'>
                <Briefcase size={14} className='text-amber-500' />
                <span className='text-[10px] font-bold uppercase tracking-tighter'>
                  Dự án tham gia
                </span>
              </div>
              <span className='text-xs font-bold'>
                {financialData.totalProjects}
              </span>
            </div>

            {/* Hàng 3: Đơn giá giờ */}
            <div
              className={`flex justify-between items-center ${isActive ? 'text-slate-500' : 'text-red-800/50'}`}
            >
              <div className='flex items-center gap-2'>
                <Coins size={14} className='text-emerald-500' />
                <span className='text-[10px] font-bold uppercase tracking-tighter'>
                  Lương (h)
                </span>
              </div>
              <span className='text-xs font-bold'>
                {formatCurrency(financialData.hourlyRate)}
              </span>
            </div>

            {/* Tổng lương */}
            <div
              className={`pt-2 border-t border-dashed flex justify-between items-center ${
                isActive ? 'border-slate-200' : 'border-rose-200'
              }`}
            >
              <div
                className={`flex items-center gap-2 ${isActive ? 'text-sky-700' : 'text-rose-700'}`}
              >
                <BadgeDollarSign size={16} />
                <span className='text-[11px] font-black uppercase tracking-tighter'>
                  Tổng lương
                </span>
              </div>
              <span
                className={`text-sm font-black ${isActive ? 'text-sky-700' : 'text-rose-700'}`}
              >
                {formatCurrency(financialData.totalIncome)}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  },
)

UserCard.displayName = 'UserCard'
export default UserCard
