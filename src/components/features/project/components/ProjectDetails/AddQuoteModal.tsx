'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import * as z from 'zod'
import { toast } from 'sonner'
import {
  X,
  Check,
  Loader2,
  FileText,
  PlusCircle,
  Hash,
  Banknote,
  Edit3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@/components/ui'
import { quotationService } from '@/services'
import nProgress from 'nprogress'

const formSchema = z.object({
  desc: z.string().min(1, 'Vui lòng nhập nội dung'),
  cost: z.string().min(1, 'Vui lòng nhập đơn giá'),
  quantity: z.string().min(1, 'Số lượng tối thiểu là 1'),
})

const AddQuoteModal = ({
  isOpen,
  onClose,
  projectId,
  type,
  onRefresh,
  editData,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!editData

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { desc: '', cost: '', quantity: '1' },
  })

  // Cập nhật giá trị khi mở mode Edit
  useEffect(() => {
    if (editData && isOpen) {
      form.reset({
        desc: editData.desc,
        cost: String(editData.cost),
        quantity: String(editData.quantity),
      })
    } else if (!isOpen) {
      form.reset({ desc: '', cost: '', quantity: '1' })
    }
  }, [editData, isOpen, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    nProgress.start()

    try {
      const payload = {
        desc: values.desc,
        cost: Number(values.cost),
        quantity: Number(values.quantity),
        quotationType: type,
        projectId: projectId,
      }

      if (isEdit) {
        await quotationService.updateQuotation(editData._id, payload)
        toast.success('Cập nhật thành công')
      } else {
        await quotationService.createQuotation(payload)
        toast.success(
          type === 'quotation'
            ? 'Thêm báo giá thành công'
            : 'Thêm phát sinh thành công',
        )
      }

      onClose()
      if (onRefresh) await onRefresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
      nProgress.done()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-[250] flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl'
          >
            <div
              className={cn(
                'p-6 text-white',
                isEdit
                  ? 'bg-blue-600'
                  : type === 'quotation'
                    ? 'bg-slate-900'
                    : 'bg-emerald-600',
              )}
            >
              <div className='flex items-center gap-3 text-2xl font-black uppercase'>
                {isEdit ? <Edit3 /> : <FileText />}
                <span>
                  {isEdit
                    ? 'Chỉnh sửa'
                    : type === 'quotation'
                      ? 'Báo giá gốc'
                      : 'Phát sinh'}
                </span>
              </div>
              <button
                onClick={onClose}
                className='absolute top-8 right-8 p-2 hover:bg-white/20 rounded-full'
              >
                <X size={20} />
              </button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='p-8 space-y-6'
              >
                <FormField
                  control={form.control}
                  name='desc'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[10px] font-bold uppercase text-slate-500 tracking-widest'>
                        Nội dung hạng mục
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ví dụ: Xây tường...'
                          {...field}
                          className='h-12 rounded-full border-none bg-slate-50 font-semibold'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-5'>
                  <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1'>
                          <Hash size={12} /> SL
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            className='h-12 rounded-full border-none bg-slate-50 font-bold text-center'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='cost'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1'>
                          <Banknote size={12} /> Đơn giá (CZK)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            className='h-12 rounded-full border-none bg-slate-50 font-bold text-blue-600'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-4 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onClose}
                    className='flex-1 rounded-full h-12 font-bold text-slate-400'
                  >
                    HỦY
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className={cn(
                      'flex-1 rounded-full h-12 font-bold text-white',
                      isEdit
                        ? 'bg-blue-600'
                        : type === 'quotation'
                          ? 'bg-slate-900'
                          : 'bg-emerald-600',
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className='animate-spin' />
                    ) : (
                      <Check className='mr-2' />
                    )}{' '}
                    XÁC NHẬN
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddQuoteModal
