'use client'

import { format } from 'date-fns'
import {
  CalendarIcon,
  Check,
  CreditCard,
  Wallet,
  Loader2,
  X,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
  Textarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from '@/components/ui'
import { useAddPayment } from '@/components/features/project/hooks'

const AddPaymentModal = ({ isOpen, onClose, project, onRefresh }: any) => {
  const {
    form,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    showResults,
    setShowResults,
    customerData,
    isLoadingCustomer,
    hasDeposit,
    onSubmit,
    handleSelectReceiver,
    handleClearReceiver,
  } = useAddPayment(project, isOpen, onClose, onRefresh)
  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-200 flex items-center justify-center p-4 md:p-6'>
          {/* Backdrop layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className='relative w-full max-w-lg rounded-[2.5rem] overflow-hidden'
          >
            {/* Header section - Adaptive color based on type */}
            <div
              className={cn(
                'p-6 text-white relative transition-colors duration-500',
                form.watch('type') === 'deposit'
                  ? 'bg-amber-500'
                  : 'bg-sky-600',
              )}
            >
              <div
                className='flex items-center gap-3 text-2xl font-bold uppercase 
                          tracking-tight'
              >
                {form.watch('type') === 'deposit' ? (
                  <Wallet className='w-7 h-7' />
                ) : (
                  <CreditCard className='w-7 h-7' />
                )}
                <span>Ghi nhận thu tiền</span>
              </div>
              <p
                className='text-white/80 text-[10px] uppercase tracking-[0.2em] mt-2 
                          font-bold'
              >
                Quản lý dòng tiền dự án & cọc của khách hàng
              </p>

              <button
                onClick={onClose}
                className='absolute top-8 right-8 p-2 hover:bg-white/20 rounded-full 
                          transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='p-8 space-y-6 bg-white'
              >
                {/* Segmented Control Toggle */}
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <div className='flex bg-slate-100 p-0.5 border rounded-full relative'>
                      {['payment', 'deposit'].map(t => {
                        const isDepositOption = t === 'deposit'
                        const isDisabled = isDepositOption && hasDeposit

                        return (
                          <button
                            key={t}
                            type='button'
                            disabled={isDisabled}
                            onClick={() => field.onChange(t)}
                            className={cn(
                              'flex-1 py-2.5 text-[11px] cursor-pointer font-black uppercase' +
                                'tracking-wider rounded-full transition-all duration-200 relative',
                              field.value === t
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600',
                              isDisabled &&
                                'opacity-40 cursor-not-allowed filter grayscale',
                            )}
                          >
                            {t === 'payment'
                              ? 'Thanh toán đợt'
                              : 'Tiền đặt cọc'}

                            {/* Hiển thị dòng text nhỏ nếu đã có cọc */}
                            {isDisabled && (
                              <span
                                className='absolute text-amber-600 -bottom-0.5 
                                          left-1/2 -translate-x-1/2 text-[10px] lowercase 
                                          font-medium whitespace-nowrap'
                              >
                                (Đã nhận cọc)
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {/* Amount Field */}
                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel
                          className='text-[10px] font-bold uppercase 
                                  text-slate-500 tracking-widest ml-1'
                        >
                          Số tiền (CZK)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='0'
                            onWheel={e => (e.target as HTMLInputElement).blur()}
                            type='number'
                            {...field}
                            onFocus={e => e.target.select()}
                            className='h-12 px-5 text-md rounded-full bg-slate-50 text-xl 
                                      font-semibold transition-all'
                          />
                        </FormControl>
                        <FormMessage className='text-[11px]' />
                      </FormItem>
                    )}
                  />

                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name='receivedDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel
                          className='text-[10px] font-bold uppercase 
                                  text-slate-500 tracking-widest ml-1'
                        >
                          Ngày nhận
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'h-12 rounded-full bg-slate-50 pl-4 text-left font-bold' +
                                    'text-slate-700',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy')
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className='w-auto p-0 bg-white rounded-3xl shadow-full z-300'
                            align='start'
                          >
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className='text-[11px]' />
                      </FormItem>
                    )}
                  />

                  {/* Method Select */}
                  <FormField
                    control={form.control}
                    name='method'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className='text-[10px] font-bold uppercase text-slate-500 
                                    tracking-widest ml-1'
                        >
                          Phương thức
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className='h-12 py-6 w-full rounded-full 
                                      bg-slate-50 font-semibold text-slate-700 shadow-none'
                            >
                              <SelectValue placeholder='Chọn phương thức' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            position='popper'
                            sideOffset={0}
                            className='rounded-xl border-slate-100 z-1000 bg-white'
                          >
                            <SelectItem value='cash'>Tiền mặt</SelectItem>
                            <SelectItem value='bank_transfer'>
                              Chuyển khoản
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[11px]' />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Người nhận tiền (Combobox) */}

                <FormField
                  control={form.control}
                  name='receiverId'
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormLabel
                        className='text-[10px] font-bold uppercase text-slate-500 
                                  tracking-widest ml-1'
                      >
                        Người nhận tiền (Tên hoặc SĐT)
                      </FormLabel>
                      <div className='relative group'>
                        <FormControl>
                          <Input
                            placeholder='Nhập tên hoặc số điện thoại...'
                            value={searchQuery}
                            onChange={e => {
                              setSearchQuery(e.target.value)
                              setShowResults(true)
                              if (e.target.value === '') field.onChange('')
                            }}
                            onFocus={() => setShowResults(true)}
                            // Thêm padding-right lớn hơn để không bị đè lên các icon
                            className='h-12 px-5 pr-12 rounded-full bg-slate-50 
                                      font-semibold text-slate-700 transition-all'
                          />
                        </FormControl>

                        <div
                          className='absolute right-2 top-1/2 -translate-y-1/2 flex 
                                    items-center gap-1'
                        >
                          {/* Nút Hủy (Clear) - Chỉ hiện khi có chữ hoặc đã chọn người */}
                          {(searchQuery.length > 0 || field.value) && (
                            <button
                              type='button'
                              onClick={() => {
                                setSearchQuery('')
                                field.onChange('')
                                setShowResults(false)
                              }}
                              className='p-1.5 hover:bg-slate-200 rounded-full cursor-pointer
                                      text-slate-400 hover:text-slate-600 transition-colors'
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          )}

                          {/* Icon trạng thái (Search hoặc Loading) */}
                          <div className='p-2'>
                            {isLoadingCustomer ? (
                              <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
                            ) : (
                              <Search size={16} className='text-slate-300' />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dropdown kết quả (Giữ nguyên logic cũ) */}
                      <AnimatePresence>
                        {showResults && searchQuery.trim().length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='absolute z-300 top-18 w-full bg-white rounded-2xl 
                                      border border-slate-50 max-h-62.5 overflow-y-auto 
                                      p-2 custom-scrollbar'
                          >
                            {customerData?.length > 0
                              ? customerData.map((person: any) => (
                                  <div
                                    key={person._id}
                                    onClick={() => {
                                      field.onChange(person._id)
                                      setSearchQuery(person.fullName)
                                      setShowResults(false)
                                    }}
                                    className={cn(
                                      'flex items-center justify-between px-4 py-3' +
                                        'cursor-pointer rounded-xl transition-all' +
                                        'hover:bg-slate-50 active:scale-[0.98]',
                                      field.value === person._id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-700',
                                    )}
                                  >
                                    <div className='flex flex-col'>
                                      <span className='font-bold text-sm'>
                                        {person.fullName}
                                      </span>
                                      <span className='text-[10px] opacity-60'>
                                        {person.phone || 'Chưa có SĐT'}
                                      </span>
                                    </div>
                                    {field.value === person._id && (
                                      <Check size={16} />
                                    )}
                                  </div>
                                ))
                              : !isLoadingCustomer && (
                                  <div className='py-6 text-center text-slate-400'>
                                    <p className='text-xs font-medium'>
                                      Không tìm thấy kết quả
                                    </p>
                                  </div>
                                )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <FormMessage className='text-[11px]' />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name='note'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className='text-[10px] font-bold uppercase text-slate-500 
                                  tracking-widest ml-1'
                      >
                        Ghi chú
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Thông tin bổ sung...'
                          {...field}
                          onFocus={e => e.target.select()}
                          className='rounded-2xl bg-slate-50 min-h-25 p-4 resize-none'
                        />
                      </FormControl>
                      <FormMessage className='text-[11px]' />
                    </FormItem>
                  )}
                />

                {/* Footer Actions */}
                <div className='flex gap-4 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onClose}
                    className='flex-1 rounded-full h-12 font-bold text-slate-400'
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className={cn(
                      'flex-1 rounded-full h-12 font-bold text-white transition-all' +
                        'hover:scale-[1.02] active:scale-[0.98]',
                      form.watch('type') === 'deposit'
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-slate-900 hover:bg-slate-800',
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    ) : (
                      <Check className='mr-2 h-5 w-5' />
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

export default AddPaymentModal
