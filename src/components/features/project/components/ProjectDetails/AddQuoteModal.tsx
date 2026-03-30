'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  Loader2,
  FileText,
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

import { useAddQuote } from '@/components/features/project/hooks'
import { getQuoteTheme } from '@/constants'

const AddQuoteModal = ({
  isOpen,
  onClose,
  projectId,
  type,
  onRefresh,
  editData,
}: any) => {
  const { form, isSubmitting, isEdit, onSubmit } = useAddQuote(
    isOpen,
    onClose,
    projectId,
    type,
    onRefresh,
    editData,
  )

  // Tối ưu UI color logic
  const theme = getQuoteTheme(isEdit, type)
  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-250 flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className='relative  w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl'
          >
            <div className={theme.header}>
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
                className='p-8 space-y-6 bg-white'
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
                          className='h-12 rounded-full bg-slate-50 font-semibold focus-visible:ring-blue-100'
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
                            onWheel={e => (e.target as HTMLInputElement).blur()}
                            onFocus={e => e.target.select()}
                            className='h-12 rounded-full bg-slate-50 font-semibold text-center'
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
                            onWheel={e => (e.target as HTMLInputElement).blur()}
                            onFocus={e => e.target.select()}
                            className='h-12 rounded-full font-semibold bg-slate-50'
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
                    className={theme.submitBtn}
                  >
                    {isSubmitting ? (
                      <Loader2 className='animate-spin' />
                    ) : (
                      <Check className='mr-2' />
                    )}
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
