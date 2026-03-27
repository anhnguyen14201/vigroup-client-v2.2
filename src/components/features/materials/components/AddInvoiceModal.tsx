'use client'

import { useState, useRef, useCallback, type FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarIcon,
  ImagePlus,
  Loader2,
  X,
  FileText,
  Receipt,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'
import {
  useInvoiceForm,
  useMaterialContext,
} from '@/components/features/materials/hooks'

const paymentMethods = [
  { label: 'Tiền mặt', value: 'cash' },
  { label: 'Chuyển khoản', value: 'bankTransfer' }, // Sửa bank_transfer -> bankTransfer
  { label: 'Na fakturu', value: 'onInvoice' },
]

const invoiceGroups = [
  { label: 'Vật liệu', value: 'materials' },
  { label: 'Xăng xe', value: 'fuel' },
  { label: 'Chi phí phụ', value: 'otherExpenses' },
]

const formSchema = z.object({
  totalAmount: z.string().min(1, 'Nhập số tiền'),
  invoiceGroup: z.string(),
  paymentMethod: z.string(),
  purchasePlace: z.string().min(1, 'Nhập nơi mua'),
  projectId: z.string().min(1, 'Chọn dự án'),
  createdAt: z.date(),
  note: z.string().optional(),
})

interface FilePreview {
  url: string
  type: string
  name: string
}

export const AddInvoiceModal = () => {
  const {
    form,
    loading,
    previews,
    fileInputRef,
    projects,
    isModalOpen,
    handleFileChange,
    removeFile,
    onSubmit,
    closeInvoiceModal,
    isEdit,
    handleBackdropClick,
  } = useInvoiceForm()

  if (!isModalOpen) return null

  return (
    <AnimatePresence>
      <div
        className='fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden'
        onClick={handleBackdropClick}
      >
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
          onClick={handleBackdropClick}
        />

        {/* MODAL CONTENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={e => e.stopPropagation()}
          className='relative bg-white w-full max-w-6xl h-[92vh] rounded-[40px] flex flex-col border border-slate-100 overflow-hidden shadow-2xl'
        >
          {/* HEADER */}
          <div className='p-8 pb-4 flex items-center justify-between border-b'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-2xl bg-[#C84848] flex items-center justify-center text-white'>
                <Receipt size={22} />
              </div>
              <div>
                <h2 className='text-xl font-black text-slate-900 uppercase tracking-tight'>
                  {isEdit ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
                </h2>
              </div>
            </div>
            <button
              onClick={closeInvoiceModal}
              className='p-2 hover:bg-slate-100 rounded-full transition-colors'
            >
              <X size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className='flex-1 overflow-y-auto p-5 lg:p-10 no-scrollbar'>
            <Form {...form}>
              <div className='grid grid-cols-1 lg:grid-cols-2  gap-5 lg:gap-16'>
                {/* LEFT COLUMN: FORM FIELDS */}
                <div className='space-y-6'>
                  <div className='grid lg:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='createdAt'
                      render={({ field }) => (
                        <FormItem className='flex flex-col gap-1'>
                          <FormLabel className='text-[10px] font-semibold uppercase text-slate-400 ml-1 tracking-widest'>
                            Ngày mua
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    'h-11 rounded-full bg-slate-50 font-bold justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? format(field.value, 'dd/MM/yyyy')
                                    : 'Chọn ngày'}
                                  <CalendarIcon className='h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0 z-100 bg-white rounded-3xl'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={vi}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='totalAmount'
                      render={({ field }) => (
                        <FormItem className='gap-1'>
                          <FormLabel className='text-[10px] font-semibold uppercase text-slate-400 ml-1 tracking-widest'>
                            Số tiền
                          </FormLabel>
                          <FormControl>
                            <Input
                              autoFocus
                              onFocus={e => e.target.select()}
                              onWheel={e =>
                                (e.target as HTMLInputElement).blur()
                              }
                              placeholder='0'
                              type='number'
                              {...field}
                              className='h-11 rounded-full bg-slate-50 font-semibold text-lg'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4'>
                    <FormField
                      control={form.control}
                      name='projectId'
                      render={({ field }) => (
                        <FormItem className='gap-1'>
                          <FormLabel
                            className='text-[10px] font-semibold uppercase text-slate-400 
                            ml-1 tracking-widest'
                          >
                            Dự án / Công trình
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='w-full h-10 px-4 py-5 rounded-full bg-slate-50 
                                    font-bold text-sm shadow-none focus:ring-2 
                                    focus:ring-slate-200 outline-none transition-all'
                              >
                                <SelectValue placeholder='Chọn dự án...' />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent
                              position='popper'
                              sideOffset={0}
                              className='rounded-xl border z-1000 bg-white'
                            >
                              {' '}
                              {projects && projects.length > 0 ? (
                                projects.map((p: any) => (
                                  <SelectItem
                                    key={p._id}
                                    value={p._id}
                                    className='py-3 focus:bg-slate-50 cursor-pointer rounded-xl'
                                  >
                                    <div className='flex flex-col gap-0.5'>
                                      <span className='text-sm font-semibold uppercase'>
                                        {p.projectName}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <div className='p-4 text-center text-xs text-slate-400'>
                                  Không có dự án nào
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[11px] font-medium' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='purchasePlace'
                      render={({ field }) => (
                        <FormItem className='gap-1'>
                          <FormLabel className='text-[10px] font-semibold uppercase text-slate-400 ml-1 tracking-widest'>
                            Nơi mua hàng
                          </FormLabel>
                          <FormControl>
                            <Input
                              onFocus={e => e.target.select()}
                              placeholder='Tên cửa hàng, siêu thị...'
                              {...field}
                              className='h-11 rounded-full bg-slate-50 font-semibold'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem className='gap-1'>
                        <FormLabel className='text-[10px] font-semibold uppercase text-slate-400 ml-1 tracking-widest'>
                          Phương thức thanh toán
                        </FormLabel>
                        <div className='flex p-0.5 bg-slate-50 rounded-full border relative h-12'>
                          {paymentMethods.map(item => (
                            <button
                              key={item.value}
                              type='button'
                              onClick={() => field.onChange(item.value)}
                              className={cn(
                                'flex-1 relative z-10 text-[11px] font-bold transition-colors duration-300 uppercase',
                                field.value === item.value
                                  ? 'text-white'
                                  : 'text-slate-400',
                              )}
                            >
                              {item.label}
                              {field.value === item.value && (
                                <motion.div
                                  layoutId='activePayment'
                                  className='absolute inset-0 bg-primary rounded-full -z-10'
                                  transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 0.6,
                                  }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='invoiceGroup'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-semibold uppercase text-slate-400 ml-1 tracking-widest'>
                          Nhóm hóa đơn
                        </FormLabel>
                        <div className='flex p-0.5 bg-slate-50 border rounded-full relative h-12'>
                          {invoiceGroups.map(item => (
                            <button
                              key={item.value}
                              type='button'
                              onClick={() => field.onChange(item.value)}
                              className={cn(
                                'flex-1 relative z-10 text-[11px] font-bold transition-colors duration-300 uppercase',
                                field.value === item.value
                                  ? 'text-white'
                                  : 'text-slate-400',
                              )}
                            >
                              {item.label}
                              {field.value === item.value && (
                                <motion.div
                                  layoutId='activeGroup'
                                  className='absolute inset-0 bg-slate-900 rounded-full -z-10 shadow-sm'
                                  transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 0.6,
                                  }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* RIGHT COLUMN: ATTACHMENTS */}
                <div className='space-y-4'>
                  <FormLabel className='text-[10px] font-semibold uppercase text-slate-400 ml-1'>
                    Đính kèm (Ảnh/PDF)
                  </FormLabel>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className='border-3 border-dashed rounded-4xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all bg-slate-50/30 active:scale-[0.97]'
                  >
                    <input
                      ref={fileInputRef}
                      type='file'
                      multiple
                      accept='image/*,application/pdf'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                    <ImagePlus
                      className='text-slate-300 mb-2'
                      size={40}
                      strokeWidth={1.5}
                    />
                    <span className='text-[11px] font-bold text-slate-400 uppercase tracking-widest'>
                      Chụp ảnh hoặc chọn file
                    </span>
                  </div>

                  {/* Grid hiển thị Preview */}
                  <div className='grid grid-cols-3 gap-3'>
                    <AnimatePresence>
                      {previews.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className='relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group'
                        >
                          {file.url.toLowerCase().endsWith('.pdf') ? (
                            <div className='w-full h-full flex flex-col items-center justify-center p-4 bg-red-50 text-red-500'>
                              <FileText size={32} strokeWidth={1.5} />
                              <span className='text-[8px] font-black mt-2 truncate w-full text-center px-2 uppercase'>
                                Tài liệu PDF
                              </span>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt='preview'
                              className='w-full h-full object-cover'
                            />
                          )}

                          <button
                            type='button'
                            onClick={e => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                            className='absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors'
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Form>
          </div>

          {/* FOOTER */}
          <div className='p-8 border-t border-slate-50 flex gap-4 bg-white/80 backdrop-blur-md'>
            <Button
              variant='outline'
              onClick={closeInvoiceModal}
              className='flex-1 h-14 uppercase rounded-full text-xs font-bold border-slate-100 hover:bg-slate-50'
            >
              Hủy bỏ
            </Button>
            <Button
              disabled={loading}
              onClick={onSubmit}
              className='flex-1 h-14 rounded-full text-xs font-bold text-white'
            >
              {loading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='animate-spin' size={20} />
                  <span>ĐANG XỬ LÝ...</span>
                </div>
              ) : (
                'LƯU HÓA ĐƠN'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
