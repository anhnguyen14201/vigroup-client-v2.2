'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Calendar,
  Receipt,
  CheckCircle2,
  Trash2,
  Wallet,
  UserCheck,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/utils'
import AddPaymentModal from '@/components/features/project/components/ProjectDetails/AddPaymentModal'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal'
import { toast } from 'sonner'
import { projectService } from '@/services'
import nProgress from 'nprogress'

const PaymentsTab = ({ project, onRefresh }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  // 1. Xử lý logic hiển thị phương thức thanh toán
  const getMethodDisplay = (method: string) => {
    switch (method) {
      case 'cash':
        return {
          label: 'Tiền mặt',
          icon: <Banknote size={14} className='text-blue-500' />,
        }
      case 'bank_transfer':
        return {
          label: 'Chuyển khoản',
          icon: <CreditCard size={14} className='text-purple-500' />,
        }
      default:
        return {
          label: 'Khác',
          icon: <Wallet size={14} className='text-slate-400' />,
        }
    }
  }

  // 2. Map dữ liệu Tiền đặt cọc (Deposit)
  const depositPayment =
    project?.deposit?.amount > 0
      ? {
          id: 'deposit',
          amount: project.deposit.amount,
          receivedDate: project.deposit.receivedDate,
          note: project.deposit.note || 'Đặt cọc dự án',
          receivedBy: project.deposit.receivedBy?.fullName || 'N/A',
          method: project.deposit.method,
          status: 'completed',
          isDeposit: true,
        }
      : null

  // 3. Map danh sách các đợt thanh toán (Payments)
  const realPayments =
    project?.payments?.map((p: any, index: number) => ({
      id: p._id,
      index: index,
      amount: p.amount,
      receivedDate: p.receivedDate,
      note: p.note,
      receivedBy: p.receivedBy?.fullName || 'N/A',
      displayTitle: p.note || `Thanh toán đợt ${index + 1}`,
      method: p.method,
      status: 'completed',
      isDeposit: false,
    })) || []

  const allTransactions = depositPayment
    ? [depositPayment, ...realPayments]
    : realPayments

  // Thống kê số liệu
  const totalAmount = project?.totalAmount || 0
  const totalReceived = project?.totalReceived || 0
  const remainingAmount = Math.max(0, totalAmount - totalReceived)
  const paymentPercentage =
    totalAmount > 0 ? ((totalReceived / totalAmount) * 100).toFixed(1) : 0

  const handleDeleteClick = (payment: any) => {
    setSelectedPayment(payment)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPayment || !project?._id) return
    setIsDeleting(true)
    nProgress.start()

    try {
      if (selectedPayment.isDeposit) {
        // API Xóa deposit: DELETE /projects/:id/deposit/
        await projectService.deleteDeposit(project._id)
      } else {
        // API Xóa payment theo index: DELETE /projects/:id/payment
        // Body: { index: number }
        await projectService.deletePayment(project._id, {
          index: selectedPayment.index,
        })
      }

      toast.success(
        selectedPayment.isDeposit
          ? 'Đã xóa khoản đặt cọc'
          : 'Đã xóa đợt thanh toán thành công',
      )

      setIsDeleteModalOpen(false)
      if (onRefresh) await onRefresh()
    } catch (error: any) {
      console.error('Delete Error:', error)
      toast.error(
        error?.response?.data?.error || 'Có lỗi xảy ra khi xóa khoản thu này',
      )
    } finally {
      nProgress.done()
      setIsDeleting(false)
      setSelectedPayment(null)
    }
  }

  return (
    <TabsContent value='payments' className='m-0 focus-visible:outline-none'>
      <div className='space-y-6'>
        {/* Dashboard Thống kê */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-rose-600 p-6 rounded-4xl text-white'>
            <p className='text-[10px] font-black uppercase tracking-widest opacity-80 mb-1'>
              Còn lại phải thu
            </p>
            <h3 className='text-2xl font-black italic'>
              {formatCurrency(remainingAmount)}{' '}
            </h3>
          </div>

          <div className='bg-white p-6 rounded-4xl border'>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
              Tổng đã thu
            </p>
            <div className='flex items-end gap-2'>
              <h3 className='text-2xl font-black text-emerald-600'>
                {formatCurrency(totalReceived)}
              </h3>
              <span className='text-[10px] font-bold text-emerald-500 mb-1.5'>
                ({paymentPercentage}%)
              </span>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className='w-full rounded-4xl h-full font-bold text-md lg:text-lg gap-2 border
                      bg-sky-600 hover:bg-sky-700'
          >
            <Plus size={16} /> Thanh toán
          </Button>
        </div>

        {/* Bảng danh sách giao dịch */}
        <div className='bg-white rounded-[2.5rem] border overflow-hidden'>
          <div className='p-8 border-b'>
            <div className='flex items-center gap-3'>
              <div
                className='w-10 h-10 bg-slate-50 rounded-xl flex items-center 
                            justify-center text-slate-400'
              >
                <Receipt size={20} />
              </div>
              <div>
                <h4 className='font-black text-slate-800 uppercase text-sm tracking-tight'>
                  Lịch sử giao dịch
                </h4>
                <p className='text-[10px] text-slate-400 font-medium'>
                  Chi tiết các khoản thu và phương thức
                </p>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto max-h-[500px] overflow-y-auto no-scrollbar'>
            {' '}
            <table className='w-full'>
              <thead>
                <tr className='bg-slate-50/50 border-b'>
                  <th className='px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    Nội dung & Người nhận
                  </th>
                  <th className='px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    Phương thức
                  </th>
                  <th className='px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    Ngày thu
                  </th>
                  <th className='px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    Số tiền
                  </th>
                  <th className='px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    Trạng thái
                  </th>
                  <th className='px-8 py-4 text-right'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                {allTransactions.length > 0 ? (
                  allTransactions.map((payment: any) => {
                    const methodInfo = getMethodDisplay(payment.method)
                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='group hover:bg-slate-50/30 transition-colors 
                                    overflow-y-auto no-scrollbar h-full'
                      >
                        <td className='px-8 py-5'>
                          <div className='flex flex-col gap-1.5'>
                            <div
                              className='flex items-center gap-1.5 text-[11px] font-bold 
                                        text-primary bg-slate-100 w-fit px-2 py-0.5 
                                        rounded-full'
                            >
                              <UserCheck size={10} />
                              <span>{payment.receivedBy}</span>
                            </div>

                            <div className='flex items-center gap-2'>
                              {payment.isDeposit ? (
                                <Wallet size={14} className='text-amber-500' />
                              ) : (
                                <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
                              )}
                              <span
                                className='text-[10px] font-bold text-slate-800 uppercase
                                            tracking-tight'
                              >
                                {payment.isDeposit
                                  ? payment.note
                                  : payment.displayTitle}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className='px-8 py-5'>
                          <div
                            className='flex items-center gap-2 text-xs font-bold 
                                        text-slate-600'
                          >
                            {methodInfo.icon}
                            {methodInfo.label}
                          </div>
                        </td>

                        <td className='px-8 py-5'>
                          <div
                            className='flex items-center gap-1.5 font-bold text-[11px] 
                                        text-slate-600'
                          >
                            <Calendar size={12} className='text-slate-400' />
                            {payment.receivedDate
                              ? new Date(
                                  payment.receivedDate,
                                ).toLocaleDateString('cs-CZ')
                              : '---'}
                          </div>
                        </td>

                        <td className='px-8 py-5 text-right'>
                          <span
                            className={`text-sm font-bold 
                                        ${
                                          payment.isDeposit
                                            ? 'text-amber-600'
                                            : 'text-sky-600'
                                        }`}
                          >
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>

                        <td className='px-8 py-5'>
                          <div className='flex justify-center'>
                            <span
                              className='px-3 py-1 bg-emerald-50 text-emerald-600 
                                        text-[10px] font-black rounded-full flex items-center 
                                        gap-1.5 border border-emerald-100'
                            >
                              <CheckCircle2 size={12} /> ĐÃ THU
                            </span>
                          </div>
                        </td>

                        <td className='px-8 py-5 text-right'>
                          <button
                            onClick={() => handleDeleteClick(payment)}
                            className='p-2 text-slate-300 hover:text-rose-500 
                                    hover:bg-rose-50 rounded-full transition-all 
                                    cursor-pointer group-hover:scale-110 active:scale-90'
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-8 py-20 text-center text-slate-400 italic text-xs'
                    >
                      Chưa có dữ liệu giao dịch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AddPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={project}
          onRefresh={onRefresh}
        />

        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
          title={
            selectedPayment?.isDeposit
              ? 'Xóa tiền đặt cọc?'
              : 'Xóa đợt thanh toán?'
          }
          description={`Bạn có chắc chắn muốn xóa số tiền ${formatCurrency(selectedPayment?.amount || 0)} CZK này không?`}
        />
      </div>
    </TabsContent>
  )
}

export default PaymentsTab
