'use client'

import React, { useState } from 'react'
import { TabsContent, Dialog, DialogContent } from '@/components/ui'
import {
  Package,
  Calendar,
  User,
  Store,
  Receipt,
  X,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  Filter,
  ExternalLink,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentPreviewModal, Pagination } from '@/components/shared'
import { formatCurrency } from '@/utils'

const MaterialsTab = ({
  invoices,
  totalItems,
  isLoading,
  setCurrentPage,
  totalPages,
  currentPage,
  totalInvoiceAmount,
}: any) => {
  const [previewFile, setPreviewFile] = useState<{
    url: string
    type: 'pdf' | 'image'
  } | null>(null)

  // Helper cho Method (Thanh toán)
  const getPaymentBadge = (method: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      cash: {
        label: 'Tiền mặt',
        className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      bankTransfer: {
        label: 'Chuyển khoản',
        className: 'bg-blue-50 text-blue-600 border-blue-100',
      },
      onInvoice: {
        label: 'Công nợ',
        className: 'bg-amber-50 text-amber-600 border-amber-100',
      },
    }
    const config = configs[method] || {
      label: method,
      className: 'bg-slate-50 text-slate-500',
    }
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${config.className}`}
      >
        {config.label}
      </span>
    )
  }

  const [previewFiles, setPreviewFiles] = useState<string[]>([])

  // 2. Cập nhật hàm handle (nhận cả mảng images)
  const handlePreview = (urls: string[]) => {
    if (urls && urls.length > 0) {
      setPreviewFiles(urls)
    }
  }
  // Helper cho Group (Loại chi phí)
  const getGroupLabel = (group: string) => {
    const groups: Record<string, { label: string; color: string }> = {
      materials: { label: 'Vật tư', color: 'text-indigo-500' },
      fuel: { label: 'Nhiên liệu', color: 'text-orange-500' },
      otherExpenses: { label: 'Chi phí khác', color: 'text-slate-500' },
    }
    return groups[group] || { label: group, color: 'text-slate-500' }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64 w-full'>
        <div className='flex flex-col items-center gap-2'>
          <div className='w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin' />
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
            Đang đồng bộ...
          </p>
        </div>
      </div>
    )
  }

  return (
    <TabsContent value='materials' className='mt-0 outline-none'>
      <div className='space-y-4'>
        {/* Header Summary */}
        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-8 bg-primary rounded-full' />
            <div>
              <h3 className='text-sm font-black uppercase tracking-tight text-primary'>
                Bảng kê hóa đơn
              </h3>
              <p className='text-[10px] text-slate-400 font-bold uppercase'>
                {invoices.length} / {totalItems} hóa đơn
              </p>
            </div>
          </div>
          <div className='font-black text-lg tracking-tight text-primary'>
            {formatCurrency(totalInvoiceAmount)}
          </div>
        </div>

        {/* Invoice List */}
        <div className='space-y-2'>
          {invoices?.length > 0 ? (
            invoices.map((invoice: any, index: any) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={invoice._id}
                onClick={() => handlePreview(invoice.invoiceImages)}
                className='group relative bg-white border border-slate-100 p-4 rounded-2xl hover:border-slate-900/20 hover:bg-slate-50/30 transition-all cursor-pointer overflow-hidden'
              >
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  {/* Left: Info */}
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='hidden sm:flex w-10 h-10 bg-slate-50 rounded-xl items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-colors border border-transparent group-hover:border-slate-100'>
                      <Receipt size={18} />
                    </div>
                    <div>
                      <div className='flex items-center gap-2 mb-1'>
                        <span
                          className={`text-[10px] font-black uppercase ${getGroupLabel(invoice.invoiceGroup).color}`}
                        >
                          {getGroupLabel(invoice.invoiceGroup).label}
                        </span>
                        <span className='w-1 h-1 bg-slate-200 rounded-full' />
                        <h4 className='font-black text-slate-900 text-sm uppercase tracking-tight'>
                          {invoice.purchasePlace}
                        </h4>
                      </div>
                      <div className='flex items-center gap-3 text-slate-500'>
                        <span className='flex items-center gap-1 text-[11px] font-medium'>
                          <Calendar size={12} className='text-slate-300' />
                          {new Date(invoice.paymentDate).toLocaleDateString(
                            'vi-VN',
                          )}
                        </span>
                        {getPaymentBadge(invoice.paymentMethod)}
                      </div>
                    </div>
                  </div>

                  {/* Center: Executor */}
                  <div className='flex items-center gap-2 md:px-6'>
                    <div className='w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500'>
                      <User size={10} />
                    </div>
                    <p className='text-[11px] font-bold text-slate-600 uppercase tracking-tighter'>
                      {invoice.user.fullName}
                    </p>
                  </div>

                  {/* Right: Amount & Action */}
                  <div className='flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0'>
                    <div className='text-left md:text-right'>
                      <p className='text-base font-black text-slate-900'>
                        {formatCurrency(invoice.totalPayment)}
                      </p>
                    </div>
                    <div className='w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all'>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>

                {/* File Count Badge */}
                {invoice.invoiceImages?.length > 1 && (
                  <div className='absolute top-2 right-2 px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded-md'>
                    +{invoice.invoiceImages.length - 1} FILES
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className='text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200'>
              <Package className='mx-auto text-slate-300 mb-2' size={32} />
              <p className='text-slate-400 font-bold text-[11px] uppercase tracking-widest'>
                Dữ liệu trống
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className='pt-6'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <DocumentPreviewModal
        files={previewFiles}
        onClose={() => setPreviewFiles([])}
      />
    </TabsContent>
  )
}

export default MaterialsTab
