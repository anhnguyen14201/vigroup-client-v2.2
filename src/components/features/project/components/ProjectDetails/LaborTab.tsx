'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TabsContent } from '@/components/ui'
import {
  UserCircle,
  Phone,
  Mail,
  Clock,
  BadgeDollarSign,
  Coins,
  Users,
  Timer,
  Wallet,
} from 'lucide-react'
import { formatCurrency, formatPhone } from '@/utils'
import LaborDetailModal from '@/components/features/project/components/ProjectDetails/LaborDetailModal'

const LaborTab = ({ project }: { project: any }) => {
  const employees = project?.employees || []

  const [selectedEmp, setSelectedEmp] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenDetail = (emp: any) => {
    setSelectedEmp(emp)
    setIsModalOpen(true)
  }

  // Tính toán tổng số liệu bằng useMemo để tối ưu hiệu năng
  const totals = useMemo(() => {
    return employees.reduce(
      (acc: any, emp: any) => ({
        count: acc.count + 1,
        hours: acc.hours + (Number(emp.totalHours) || 0),
        salary: acc.salary + (Number(emp.totalSalary) || 0),
      }),
      { count: 0, hours: 0, salary: 0 },
    )
  }, [employees])

  if (employees.length === 0) {
    return (
      <TabsContent value='labor' className='m-0 outline-none'>
        <div className='flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200'>
          <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4'>
            <UserCircle size={32} />
          </div>
          <p className='text-slate-400 text-sm font-medium'>
            Chưa có dữ liệu nhân công cho dự án này
          </p>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value='labor' className='m-0 outline-none'>
      {/* 1. Header Stats Overview */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <div className='bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center'>
            <Users size={24} />
          </div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Nhân sự
            </p>
            <p className='text-lg font-black text-slate-800'>
              {totals.count} thợ
            </p>
          </div>
        </div>

        <div className='bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center'>
            <Timer size={24} />
          </div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Tổng giờ làm
            </p>
            <p className='text-lg font-black text-slate-800'>
              {totals.hours.toFixed(1)}h
            </p>
          </div>
        </div>

        <div className='bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center'>
            <Wallet size={24} />
          </div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Tổng lương thợ
            </p>
            <p className='text-lg font-black text-emerald-700'>
              {formatCurrency(totals.salary)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Employee List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {employees.map((emp: any, index: number) => (
          <motion.div
            key={emp._id}
            onClick={() => handleOpenDetail(emp)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, ease: 'easeOut' }}
            className='p-6 rounded-4xl border bg-white transition-all duration-300 
                        hover:border-primary cursor-pointer h-full'
          >
            {/* Header: Info Only */}
            <div className='flex gap-4 mb-5'>
              <div className='w-12 h-12 rounded-2xl flex items-center justify-center bg-primary text-white shadow-lg shadow-slate-100'>
                <UserCircle size={28} />
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm font-black leading-tight uppercase truncate text-slate-800 tracking-tight'>
                    {emp.fullName}
                  </h3>
                  <span className='w-2 h-2 rounded-full bg-emerald-500' />
                </div>
                <span className='inline-block mt-1 text-[9px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-widest'>
                  Thợ chính
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className='mb-5 space-y-1.5 px-1'>
              <div className='flex items-center gap-3'>
                <Phone size={13} className='text-slate-300' />
                <span className='text-xs font-bold text-slate-600'>
                  {formatPhone(emp.phone) || 'Trống'}
                </span>
              </div>
              {emp.email && (
                <div className='flex items-center gap-3'>
                  <Mail size={13} className='text-slate-300' />
                  <span className='text-xs font-medium truncate text-slate-400'>
                    {emp.email}
                  </span>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className='space-y-2 p-4 rounded-[2rem] bg-slate-50/50 border border-slate-100/50'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Clock size={13} className='text-blue-500' />
                  <span className='text-[10px] font-black text-slate-400 uppercase tracking-tighter'>
                    Công: {emp.daysWorked || 0} ngày
                  </span>
                </div>
                <span className='text-xs font-black text-slate-700'>
                  {emp.totalHours || 0}h
                </span>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Coins size={13} className='text-amber-500' />
                  <span className='text-[10px] font-black text-slate-400 uppercase tracking-tighter'>
                    Đơn giá (h)
                  </span>
                </div>
                <span className='text-xs font-bold text-slate-600'>
                  {formatCurrency(emp.hourlyRate || 0)}
                </span>
              </div>

              <div className='pt-2 mt-1 border-t border-dashed border-slate-200 flex justify-between items-center'>
                <div className='flex items-center gap-2 text-sky-700'>
                  <BadgeDollarSign size={15} />
                  <span className='text-[10px] font-black uppercase tracking-widest'>
                    Thanh toán
                  </span>
                </div>
                <span className='text-sm font-black text-sky-700'>
                  {formatCurrency(emp.totalSalary || 0)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <LaborDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmp}
        projectId={project?._id}
      />
    </TabsContent>
  )
}

export default LaborTab
