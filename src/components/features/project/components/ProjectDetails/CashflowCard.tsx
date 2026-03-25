import InfoTile from '@/components/features/project/components/ProjectDetails/InfoTile'
import { Progress } from '@/components/ui'
import { formatCurrency } from '@/utils'
import React from 'react'

const CashflowCard = ({ project }: any) => {
  const totalAmount = project?.totalAmount || 0
  const totalQuotation = project?.totalQuotationAmount || 0
  const totalVariation = project?.totalVariationAmount || 0
  const totalReceived = project?.totalReceived || 0

  // Nếu tổng tiền bằng 0 hoặc đã thu nhiều hơn tổng tiền, remaining luôn là 0
  const remaining =
    totalAmount > 0 ? Math.max(0, totalAmount - totalReceived) : 0

  const progressPercent =
    totalAmount > 0
      ? Math.min(100, Math.round((totalReceived / totalAmount) * 100))
      : 0

  return (
    <div
      className='lg:col-span-2 bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] 
                  border relative
                 overflow-hidden group'
    >
      {/* Header Section: Chuyển sang cột trên mobile */}
      <div className='flex flex-col sm:flex-row justify-between items-start gap-4 mb-8'>
        <div className='space-y-1'>
          <h4 className='font-black text-slate-800 text-base md:text-lg uppercase tracking-tight'>
            Dòng tiền dự án
          </h4>
          <p className='text-[10px] md:text-xs text-slate-400 font-medium'>
            Theo dõi các đợt thanh toán và công nợ
          </p>
        </div>

        <div
          className='text-right sm:text-right w-full sm:w-auto p-4 sm:p-0
                    sm:bg-transparent rounded-2xl'
        >
          <p className='text-[10px] font-black text-rose-500 uppercase tracking-widest'>
            Còn lại cần thu
          </p>
          <p className='text-xl font-bold text-rose-500'>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className='space-y-5'>
        {/* Progress Section */}
        <div className='space-y-3'>
          <div className='flex justify-between items-end'>
            <div className='flex flex-col gap-1'>
              <span
                className='px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] 
                           font-bold rounded-full w-fit'
              >
                ĐÃ THU {formatCurrency(totalReceived)}
              </span>
              {project?.deposit?.amount > 0 && (
                <span className='text-[9px] text-slate-400 font-medium italic pl-1'>
                  (Bao gồm cọc: {formatCurrency(project?.deposit?.amount)} CZK)
                </span>
              )}
            </div>
            <span className='text-lg lg:text-xl font-black text-emerald-600'>
              {progressPercent}%
            </span>
          </div>
          <Progress
            value={progressPercent}
            className='h-2 bg-slate-100 shadow-inner rounded-full'
          />
        </div>

        {/* Info Tiles Grid: 1 cột cho mobile, 3 cột cho desktop */}
        <div className='flex justify-between flex-col md:flex-row gap-3 md:gap-6 pt-6 border-t border-slate-100'>
          <div className='bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl'>
            <InfoTile label='Báo giá' value={totalQuotation} color='sky' />
          </div>
          <div className='bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl'>
            <InfoTile
              label='Phát sinh (+)'
              value={totalVariation}
              color='orange'
            />
          </div>
          <div className='bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl'>
            <InfoTile
              label='Tổng thực thu'
              value={totalReceived}
              color='emerald'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashflowCard
