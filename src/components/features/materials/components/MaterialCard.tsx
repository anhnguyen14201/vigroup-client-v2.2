'use client'

import {
  MapPin,
  CreditCard,
  User,
  Package,
  Fuel,
  Wallet,
  Layers,
  FileClock,
  Banknote,
  Pencil,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { formatCurrency } from '@/utils'

interface MaterialCardProps {
  invoice: any
  onPreview: (files: string[], index: number) => void
  onEdit: (invoice: any) => void // Thêm prop onEdit
  onDelete: (invoice: any) => void // Thêm prop onDelete
}

export const MaterialCard = ({
  invoice,
  onPreview,
  onEdit,
  onDelete,
}: MaterialCardProps) => {
  // 1. Cấu hình nhóm hóa đơn (invoiceGroup)
  const getGroupConfig = (group: string) => {
    switch (group) {
      case 'fuel':
        return {
          icon: <Fuel size={22} />,
          label: 'Xăng dầu',
          color: 'bg-amber-50 text-amber-600',
        }
      case 'materials':
        return {
          icon: <Package size={22} />,
          label: 'Vật tư',
          color: 'bg-blue-50 text-blue-600',
        }
      default: // otherExpenses
        return {
          icon: <Layers size={22} />,
          label: 'Chi phí khác',
          color: 'bg-purple-50 text-purple-600',
        }
    }
  }

  // 2. Cấu hình hình thức thanh toán (paymentMethod)
  const getPaymentConfig = (method: string) => {
    switch (method) {
      case 'cash':
        return {
          icon: <Wallet size={12} />,
          label: 'Tiền mặt',
          color: 'text-emerald-500',
        }
      case 'bankTransfer':
        return {
          icon: <Banknote size={12} />,
          label: 'Chuyển khoản',
          color: 'text-blue-500',
        }
      case 'onInvoice':
        return {
          icon: <FileClock size={12} />,
          label: 'Ghi nợ',
          color: 'text-orange-500',
        }
      default:
        return {
          icon: <CreditCard size={12} />,
          label: 'Khác',
          color: 'text-slate-500',
        }
    }
  }

  const group = getGroupConfig(invoice.invoiceGroup)
  const payment = getPaymentConfig(invoice.paymentMethod)
  const hasImages = invoice.invoiceImages && invoice.invoiceImages.length > 0

  return (
    <div
      className='group relative bg-white rounded-4xl border flex flex-col h-full
                p-5 transition-all duration-300 cursor-pointer overflow-hidden 
                hover:border-primary gap-2'
      onClick={() => hasImages && onPreview(invoice.invoiceImages, 0)}
    >
      <div
        className='absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 
                      transition-all duration-300 flex items-center justify-center gap-3 z-10'
      >
        <button
          onClick={e => {
            e.stopPropagation() // Ngăn sự kiện click vào Card (mở preview)
            onEdit(invoice)
          }}
          className='w-12 h-12 bg-white text-emerald-500 rounded-full border cursor-pointer 
                     hover:bg-emerald-400 hover:text-white transition-all duration-200 
                     flex items-center justify-center scale-90 group-hover:scale-100'
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onDelete(invoice)
          }}
          className='w-12 h-12 bg-white text-rose-500 rounded-full cursor-pointer border
                     hover:bg-rose-400 hover:text-white transition-all duration-200 
                     flex items-center justify-center scale-90 group-hover:scale-100'
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* --- 2. MOBILE ACTIONS (Hiện trực tiếp nút nhỏ trên Mobile) --- */}
      <div className='lg:hidden absolute top-10 right-3 flex gap-2 z-10'>
        <button
          onClick={e => {
            e.stopPropagation()
            onEdit(invoice)
          }}
          className='w-8 h-8 bg-slate-100/80 backdrop-blur-md text-slate-600 rounded-full 
                     flex items-center justify-center border border-white shadow-sm active:bg-blue-500 active:text-white'
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onDelete(invoice)
          }}
          className='w-8 h-8 bg-slate-100/80 backdrop-blur-md text-red-500 rounded-full 
                     flex items-center justify-center border border-white shadow-sm active:bg-red-500 active:text-white'
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Header: Nhóm & Trạng thái ảnh */}
      <div className='flex justify-between items-start'>
        <div className='flex items-center gap-3'>
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center 
                      transition-colors ${group.color}`}
          >
            {group.icon}
          </div>
          <div className='min-w-0'>
            <h4 className='text-[11px] font-bold text-sky-700 max-w-55'>
              {invoice.project?.projectName || 'Dự án chưa tên'}
            </h4>

            <p className='text-[11px] font-bold text-primary'>
              {format(new Date(invoice.paymentDate), 'dd/MM/yyyy')}
            </p>
          </div>
        </div>

        <div
          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black 
                    uppercase tracking-wider border ${
                      hasImages
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}
        >
          {hasImages ? `${invoice.invoiceImages.length} Ảnh` : '0 Ảnh'}
        </div>
      </div>

      {/* Info Section */}
      <div className='flex items-center justify-between gap-4 mt-auto'>
        <div className='space-y-1.5'>
          <div className='flex items-center gap-1.5 text-slate-400'>
            <MapPin size={11} />
            <p className='text-xs font-bold text-slate-700 truncate'>
              {invoice.purchasePlace || 'N/A'}
            </p>
          </div>
        </div>

        <div className='space-y-1.5'>
          <div className='flex items-baseline gap-0.5'>
            <span className='text-md font-black text-sky-700 tracking-tight'>
              {formatCurrency(invoice.totalPayment)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: User & Payment Method */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-white shadow-sm overflow-hidden'>
            {/* Có thể thay bằng Avatar image nếu có */}
            <User size={12} />
          </div>
          <span className='text-[10px] font-bold uppercase text-sky-700 italic'>
            @{invoice.user?.fullName || 'admin'}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full
                      bg-slate-50 ${payment.color}`}
          >
            {payment.icon}
            <span className='text-[10px] font-black uppercase whitespace-nowrap'>
              {payment.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
