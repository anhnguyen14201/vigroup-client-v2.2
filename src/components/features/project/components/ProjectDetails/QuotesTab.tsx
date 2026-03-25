'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/utils'
import { quotationService } from '@/services'
import { toast } from 'sonner'
import AddQuoteModal from './AddQuoteModal'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal' // Đường dẫn modal xóa của Anh

const QuotesTab = ({ project, type, onRefresh }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredQuotes =
    project?.quotes?.filter((q: any) => q.quotationType === type) || []
  const totalAmount = filteredQuotes.reduce(
    (sum: number, q: any) => sum + (q.totalPrice || 0),
    0,
  )

  // Xử lý Xóa
  const handleDelete = async () => {
    if (!selectedQuote) return
    setIsDeleting(true)
    try {
      await quotationService.deleteQuotation(selectedQuote._id)
      toast.success('Đã xóa hạng mục')
      if (onRefresh) await onRefresh()
      setIsDeleteModalOpen(false)
    } catch (error) {
      toast.error('Không thể xóa hạng mục này')
    } finally {
      setIsDeleting(false)
      setSelectedQuote(null)
    }
  }

  return (
    <TabsContent
      value={type === 'quotation' ? 'quotes' : 'additional'}
      className='m-0 focus-visible:outline-none'
    >
      <div className='space-y-6'>
        {/* Summary Card */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white p-6 rounded-4xl border flex items-center justify-between col-span-2'>
            <div>
              <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                Tổng{' '}
                {type === 'quotation' ? 'giá trị báo giá' : 'chi phí phát sinh'}
              </p>
              <h3
                className={`text-2xl font-black ${type === 'quotation' ? 'text-slate-900' : 'text-rose-600'}`}
              >
                {formatCurrency(totalAmount)}{' '}
                <span className='text-xs opacity-50 font-medium'>CZK</span>
              </h3>
            </div>
            <div
              className={`p-4 rounded-2xl ${type === 'quotation' ? 'bg-slate-50 text-slate-400' : 'bg-rose-50 text-rose-400'}`}
            >
              {type === 'quotation' ? (
                <FileText size={24} />
              ) : (
                <Plus size={24} />
              )}
            </div>
          </div>

          <Button
            onClick={() => {
              setSelectedQuote(null)
              setIsModalOpen(true)
            }}
            className='h-full text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-4xl font-bold gap-2'
          >
            <Plus size={18} /> Thêm{' '}
            {type === 'quotation' ? 'báo giá' : 'phát sinh'}
          </Button>
        </div>

        {/* Table Area */}
        <div className='bg-white rounded-[2.5rem] border overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-slate-50/50 border-b'>
              <tr>
                <th className='px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase'>
                  Nội dung công việc
                </th>
                <th className='px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase'>
                  SL
                </th>
                <th className='px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase'>
                  Đơn giá
                </th>
                <th className='px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase'>
                  Thành tiền
                </th>
                <th className='px-8 py-4'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {filteredQuotes.map((quote: any) => (
                <tr
                  key={quote._id}
                  className='group hover:bg-slate-50/30 transition-colors'
                >
                  <td className='px-8 py-5 text-[11px] font-bold text-slate-800 uppercase'>
                    {quote.desc}
                  </td>
                  <td className='px-8 py-5 text-center font-bold text-slate-600 text-xs'>
                    {quote.quantity}
                  </td>
                  <td className='px-8 py-5 text-right font-bold text-slate-600 text-xs'>
                    {formatCurrency(quote.cost)}
                  </td>
                  <td className='px-8 py-5 text-right font-black text-slate-900 text-sm'>
                    {formatCurrency(quote.totalPrice)}
                  </td>
                  <td className='px-8 py-5 text-right'>
                    <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={() => {
                          setSelectedQuote(quote)
                          setIsModalOpen(true)
                        }}
                        className='p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors'
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuote(quote)
                          setIsDeleteModalOpen(true)
                        }}
                        className='p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddQuoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedQuote(null)
        }}
        projectId={project?._id}
        type={type}
        onRefresh={onRefresh}
        editData={selectedQuote}
      />

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        loading={isDeleting}
        title='Xóa hạng mục này?'
        description={`Bạn có chắc muốn xóa "${selectedQuote?.desc}"?`}
      />
    </TabsContent>
  )
}

export default QuotesTab
