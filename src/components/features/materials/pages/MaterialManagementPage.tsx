'use client'

import { Plus, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminHeader } from '@/components/layouts'
import { FloatingActionButton } from '@/components/shared'

import {
  MaterialManagementProvider,
  useMaterialContext,
} from '@/components/features/materials/hooks'
import {
  AddInvoiceModal,
  MaterialList,
} from '@/components/features/materials/components'
import MaterialFilters from '@/components/features/materials/components/MaterialFilters'
import { formatCurrency } from '@/utils'

const MaterialManagementContent = () => {
  const { user, handleLogout, handleAddInvoice, totalInvoiceAmount } =
    useMaterialContext()
  return (
    <>
      <AdminHeader user={user} onLogout={handleLogout}>
        <h1 className='text-lg font-bold tracking-tight text-slate-900 mb-2'>
          {'QUẢN LÝ HÓA ĐƠN'}
        </h1>
      </AdminHeader>
      <div
        className='flex flex-col w-full p-6 font-sans text-slate-900 no-scrollbar overflow-y-auto'
        data-lenis-prevent
      >
        <div className='mx-auto w-full mb-8'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <MaterialFilters />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* Card Tổng Tiền */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-2xl
                      flex items-center gap-4'
          >
            <div className='w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600'>
              <Wallet className='w-6 h-6' />
            </div>
            <div>
              <p className='text-sm font-medium text-slate-500'>
                Tổng giá trị hóa đơn
              </p>
              <h2 className='text-2xl font-bold text-slate-900'>
                {formatCurrency(totalInvoiceAmount)}
              </h2>
            </div>
          </motion.div>
        </div>

        <div className='w-full flex-1'>
          <MaterialList />
        </div>
      </div>
      <AddInvoiceModal />
      {/* 2. Nút FAB để mở Modal */}
      <FloatingActionButton onClick={handleAddInvoice} icon={Plus} />{' '}
    </>
  )
}

export default function MaterialManagementPage() {
  return (
    <MaterialManagementProvider itemsPerPage={12}>
      <MaterialManagementContent />
    </MaterialManagementProvider>
  )
}
