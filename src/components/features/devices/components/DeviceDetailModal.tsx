'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui'
import { Cpu, Phone, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { formatDateTimeCzech } from '@/utils'

export const DeviceDetailModal = ({ device, isOpen, onClose }: any) => {
  if (!device) return null

  return (
    <AnimatePresence>
      <div
        className='fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden'
        onClick={onClose}
      >
        {' '}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-slate-900/40 backdrop-blur-xl'
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className='relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden'
        >
          <div className='flex flex-col lg:flex-row h-full'>
            {/* LEFT COLUMN: Profile & Stats */}
            <div className='w-full lg:w-[40%] bg-slate-900 p-10 text-white flex flex-col justify-between'>
              <div className='space-y-8'>
                <div className='w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/10'>
                  <Cpu size={40} className='text-indigo-400' />
                </div>
                <div>
                  <h2 className='text-3xl font-bold leading-tight'>
                    {device.name}
                  </h2>
                </div>
                <div className='space-y-4 pt-8'>
                  <div className='flex justify-between text-sm py-3 border-b border-white/5'>
                    <span className='text-slate-400 font-medium text-xs'>
                      Mã quản lý
                    </span>
                    <span className='font-mono font-bold text-indigo-300'>
                      {device.code}
                    </span>
                  </div>

                  <div className='flex justify-between text-sm py-3 border-b border-white/5'>
                    <span className='text-slate-400 font-medium text-xs'>
                      Dự án hiện tại
                    </span>
                    <span className='font-bold text-[11px] text-emerald-400'>
                      {device.currentProject?.projectName || 'Trong kho'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='mt-12 bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4'>
                <p className='text-[10px] font-black uppercase tracking-widest text-indigo-400'>
                  Người đang giữ
                </p>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center font-bold text-xl uppercase italic'>
                    {device.userRealTime?.fullName.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className='font-bold text-sm'>
                      {device.userRealTime?.fullName || 'N/A'}
                    </p>
                    <p className='text-xs text-slate-400 italic font-medium'>
                      {device.userRealTime?.phone || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive History */}
            <div className='flex-1 p-10 bg-[#FBFCFE] flex flex-col'>
              <div className='flex justify-between items-center mb-10'>
                <h4 className='text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2'>
                  <Activity size={14} className='text-indigo-500' /> Hoạt động
                  gần đây
                </h4>
              </div>

              <div
                className='flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar 
                          max-h-125'
              >
                {device.history
                  ?.slice()
                  .reverse()
                  .map((log: any, i: number) => (
                    <div
                      key={log._id}
                      className='relative pl-8 before:absolute before:left-0 before:top-0 
                                before:-bottom-6 before:w-px before:bg-slate-200 
                                last:before:hidden'
                    >
                      <div
                        className={`absolute -left-1.25 top-1 w-2.5 h-2.5 rounded-full 
                                  ring-4 ring-white
                                  ${
                                    log.warehouse
                                      ? 'bg-emerald-500'
                                      : 'bg-indigo-500'
                                  }`}
                      />
                      <div className='bg-white rounded-2xl p-4 border transition-all'>
                        <div className='flex justify-between items-start'>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${log.warehouse ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}
                          >
                            {log.warehouse ? 'Trong kho' : 'Công trình'}
                          </span>
                          <span className='text-[10px] text-sky-600 font-bold italic'>
                            {formatDateTimeCzech(log.date)}
                          </span>
                        </div>
                        <p className='text-sm font-bold text-slate-800 mt-2'>
                          {log.user?.fullName}
                        </p>
                        <p className='text-xs text-slate-500 mt-1'>
                          {log.warehouse
                            ? 'Hoàn trả máy về kho bảo quản'
                            : `Nhận máy đi công trình: ${log.project?.projectName}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
