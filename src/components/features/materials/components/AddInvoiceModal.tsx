'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarIcon, ImagePlus, Loader2, X } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input, Button, Textarea } from '@/components/ui'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  totalAmount: z.string().min(1, 'Vui lòng nhập tổng tiền'),
  invoiceGroup: z.enum(['materials', 'fuel', 'otherExpenses']),
  paymentMethod: z.enum(['bank_transfer', 'cash', 'card', 'other']),
  purchasePlace: z.string().min(1, 'Vui lòng nhập nơi mua'),
  projectId: z.string().min(1, 'Vui lòng chọn dự án'),
  createdAt: z.date({ required_error: 'Vui lòng chọn ngày' }),
  note: z.string().optional(),
  images: z.any().optional(),
})

interface AddInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  projects: any[]
}

export const AddInvoiceModal = ({
  isOpen,
  onClose,
  projects,
}: AddInvoiceModalProps) => {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalAmount: '',
      invoiceGroup: 'materials',
      paymentMethod: 'bank_transfer',
      purchasePlace: '',
      projectId: '',
      createdAt: new Date(),
      note: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      console.log('Invoice Data:', values)
      // Gọi API create invoice của bạn ở đây
      onClose()
      form.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-lg rounded-[2.5rem] p-8 bg-white border-none shadow-2xl overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-extrabold text-slate-900 uppercase tracking-tight'>
            Thêm hóa đơn mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 mt-4'
          >
            {/* 1. Chọn Dự Án */}
            <FormField
              control={form.control}
              name='projectId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[10px] font-bold uppercase text-slate-500 ml-1'>
                    Công trình / Dự án
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='h-12 rounded-2xl bg-slate-50 border-none font-bold'>
                        <SelectValue placeholder='Chọn dự án' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='rounded-2xl'>
                      {projects.map(p => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.projectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              {/* 2. Tổng tiền */}
              <FormField
                control={form.control}
                name='totalAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[10px] font-bold uppercase text-slate-500 ml-1'>
                      Tổng tiền
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        {...field}
                        className='h-12 rounded-2xl bg-slate-50 border-none font-bold text-blue-600'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 3. Ngày tạo */}
              <FormField
                control={form.control}
                name='createdAt'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='text-[10px] font-bold uppercase text-slate-500 ml-1 mt-2'>
                      Ngày hóa đơn
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'h-12 rounded-2xl bg-slate-50 border-none font-bold text-left',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? format(field.value, 'dd/MM/yyyy')
                              : 'Chọn ngày'}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0 rounded-3xl'
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
            </div>

            {/* 4. Nhóm & Phương thức */}
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='invoiceGroup'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[10px] font-bold uppercase text-slate-500 ml-1'>
                      Nhóm
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='h-12 rounded-2xl bg-slate-50 border-none font-bold'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='rounded-xl'>
                        <SelectItem value='materials'>Vật tư</SelectItem>
                        <SelectItem value='fuel'>Xăng dầu</SelectItem>
                        <SelectItem value='otherExpenses'>
                          Chi phí khác
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paymentMethod'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[10px] font-bold uppercase text-slate-500 ml-1'>
                      Thanh toán
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='h-12 rounded-2xl bg-slate-50 border-none font-bold'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='rounded-xl'>
                        <SelectItem value='bank_transfer'>
                          Chuyển khoản
                        </SelectItem>
                        <SelectItem value='cash'>Tiền mặt</SelectItem>
                        <SelectItem value='card'>Thẻ</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* 5. Nơi mua */}
            <FormField
              control={form.control}
              name='purchasePlace'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[10px] font-bold uppercase text-slate-500 ml-1'>
                    Nơi mua (Cửa hàng...)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên cửa hàng...'
                      {...field}
                      className='h-12 rounded-2xl bg-slate-50 border-none font-bold'
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 6. Thêm ảnh */}
            <div className='space-y-2'>
              <label className='text-[10px] font-bold uppercase text-slate-500 ml-1'>
                Ảnh hóa đơn
              </label>
              <div className='border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors'>
                <ImagePlus className='text-slate-400 mb-2' size={32} />
                <span className='text-xs font-bold text-slate-400'>
                  Tải ảnh lên hoặc chụp hình
                </span>
              </div>
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl hover:bg-slate-800 transition-all'
            >
              {loading ? (
                <Loader2 className='animate-spin mr-2' />
              ) : (
                'XÁC NHẬN THÊM'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
