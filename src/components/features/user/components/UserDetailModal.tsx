'use client'

import { useState, useEffect } from 'react'
import { Clock, DollarSign, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import SummaryTab from './SummaryTab'
import FinanceTab from './FinanceTab'
import { useUserContext } from '../hooks/UserManagementContext'
import { HistoryTab } from './HistoryTab'

const UserDetailModal = () => {
  const [activeTab, setActiveTab] = useState('summary')

  const { selectedDetail, setSelectedDetail, setDetailPage } = useUserContext()
  // Khóa cuộn trang khi mở modal
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!selectedDetail) return null

  const tabs = [
    { id: 'summary', label: 'Hồ sơ', icon: <User size={18} /> },
    { id: 'finance', label: 'Lương', icon: <DollarSign size={18} /> },
    { id: 'history', label: 'Hoạt động', icon: <Clock size={18} /> },
  ]

  return (
    <AnimatePresence>
      <div
        className='fixed inset-0 z-150 flex items-center justify-center p-0 md:p-6 
                  overflow-hidden'
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => {
            setSelectedDetail(null)
            setDetailPage(1)
          }}
          className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        />

        {/* Main Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{
            duration: 0.2, // Tổng thời gian chạy chỉ 0.2s
            ease: [0.16, 1, 0.3, 1], // Đường cong chuẩn Apple (Quartic Out)
          }}
          className='relative bg-white w-full max-w-5xl h-full md:h-[85vh] 
                    md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row'
        >
          {/* Mobile Header: Hiện ra khi ở màn hình nhỏ */}
          <div
            className='md:hidden flex items-center justify-between p-4 border-b 
                      bg-white sticky top-0 z-50'
          >
            <div className='flex items-center gap-3'>
              <div
                className='w-10 h-10 rounded-full bg-primary flex items-center 
                          justify-center text-white'
              >
                <User size={20} />
              </div>
              <span className='font-bold text-slate-800'>
                {selectedDetail.fullName}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedDetail(null)
                setDetailPage(1)
              }}
              className='p-2 bg-slate-100 rounded-full text-slate-500'
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar / Navigation Area */}
          <div
            className='w-full md:w-72 bg-slate-50/50 border-r border-slate-100 
                      flex flex-col'
          >
            {/* Desktop User Info */}
            <div className='hidden md:block p-8 text-center'>
              <div className='relative w-24 h-24 mx-auto mb-4 group'>
                <div
                  className='relative w-full h-full bg-white rounded-full 
                            shadow-sm border border-slate-100 flex items-center 
                            justify-center text-primary'
                >
                  <User size={40} strokeWidth={1.5} />
                </div>
              </div>
              <h2 className='text-xl font-bold text-slate-800 truncate px-2'>
                {selectedDetail.fullName}
              </h2>
              <p className='text-[11px] font-bold text-primary uppercase tracking-widest mt-1'>
                {selectedDetail.position ||
                  (() => {
                    // Quy đổi từ mã số role sang tên hiển thị
                    switch (Number(selectedDetail.role)) {
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
                  })()}
              </p>
            </div>

            {/* Navigation - Cuộn ngang trên mobile */}
            <nav
              className='flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto no-scrollbar 
                        md:overflow-visible bg-white md:bg-transparent border-b md:border-none'
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm font-bold 
                              transition-all whitespace-nowrap flex-1 md:flex-none 
                              cursor-pointer
                              ${
                                activeTab === tab.id
                                  ? 'bg-primary text-white shadow-lg shadow-slate-200 md:translate-x-2'
                                  : 'text-slate-500 hover:bg-slate-100'
                              }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className='hidden md:block mt-auto p-6'>
              <div className='bg-indigo-50 rounded-3xl p-4 border border-indigo-100'>
                <p className='text-[10px] font-bold text-indigo-400 uppercase mb-1'>
                  Trạng thái
                </p>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${selectedDetail.isBlock ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}
                  />
                  <span className='text-xs font-bold text-slate-700'>
                    {selectedDetail.isBlock
                      ? 'Tài khoản khóa'
                      : 'Đang trực tuyến'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className='flex-1 overflow-y-auto bg-white p-6 md:p-10 no-scrollbar'>
            {activeTab === 'summary' && <SummaryTab user={selectedDetail} />}

            {activeTab === 'finance' && <FinanceTab user={selectedDetail} />}

            {activeTab === 'history' && <HistoryTab />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// --- Tối ưu các Sub-components Helper ---

export default UserDetailModal
