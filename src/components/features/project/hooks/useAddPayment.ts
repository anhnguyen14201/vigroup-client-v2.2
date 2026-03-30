import { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { projectService, userService } from '@/services'
import { usePaginatedCollection } from '@/hooks'

export const paymentFormSchema = z.object({
  amount: z.string().min(1, 'Vui lòng nhập số tiền'),
  receivedDate: z.date(),
  receiverId: z.string().min(1, 'Vui lòng chọn người nhận tiền'),
  method: z.string(),
  type: z.enum(['deposit', 'payment']),
  note: z.string().optional(),
})

export type PaymentFormValues = z.infer<typeof paymentFormSchema>

export const useAddPayment = (
  project: any,
  isOpen: boolean,
  onClose: () => void,
  onRefresh?: () => void,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const hasDeposit = useMemo(
    () => project?.deposit?.amount > 0 || project?.depositAmount > 0,
    [project],
  )

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: '',
      receivedDate: new Date(),
      receiverId: '',
      method: 'cash',
      type: 'payment',
      note: '',
    },
  })

  // Tối ưu hóa API Call: Chỉ search khi có searchQuery
  const { items: customerData, isLoading: isLoadingCustomer } =
    usePaginatedCollection(
      isOpen ? '/staff' : null,
      { tab: 'staff', search: searchQuery },
      userService.getUsers,
      1,
      'all',
    )

  // Side Effect: Cập nhật mặc định dựa trên trạng thái dự án
  useEffect(() => {
    if (isOpen) {
      const type = hasDeposit ? 'payment' : 'deposit'
      const note = hasDeposit ? 'Thanh toán đợt tiếp theo' : 'Đặt cọc dự án'
      form.reset({
        ...form.getValues(),
        type,
        note,
        receivedDate: new Date(),
      })
      setSearchQuery('')
    }
  }, [isOpen, hasDeposit, form])

  const onSubmit = useCallback(
    async (values: PaymentFormValues) => {
      if (!project?._id) return
      setIsSubmitting(true)
      nProgress.start()

      // Tạo một Promise để quản lý cả 2 loại request
      const actionPromise = async () => {
        const payload = {
          amount: Number(values.amount),
          receivedDate: values.receivedDate,
          receivedBy: values.receiverId,
          method: values.method,
          note: values.note,
        }

        if (values.type === 'deposit') {
          return await projectService.createDeposit(project._id, payload)
        } else {
          return await projectService.createPayment(project._id, payload)
        }
      }

      try {
        // Sử dụng toast.promise để hiển thị trạng thái đang xử lý
        await toast.promise(actionPromise(), {
          loading:
            values.type === 'deposit'
              ? 'Đang ghi nhận tiền đặt cọc...'
              : 'Đang ghi nhận đợt thanh toán...',
          success: () => {
            if (onRefresh) onRefresh()
            form.reset()
            onClose()
            return values.type === 'deposit'
              ? 'Đã ghi nhận tiền đặt cọc thành công'
              : 'Đã ghi nhận đợt thanh toán thành công'
          },
          error: err =>
            err?.response?.data?.message ||
            'Có lỗi xảy ra khi ghi nhận thanh toán',
        })
      } catch (error: any) {
        // Lỗi đã được xử lý trong toast.promise, ở đây chỉ cần catch để không crash app
        console.error('Payment Error:', error)
      } finally {
        setIsSubmitting(false)
        nProgress.done()
      }
    },
    [project?._id, onRefresh, form, onClose],
  )

  const handleSelectReceiver = useCallback(
    (person: any) => {
      form.setValue('receiverId', person._id)
      setSearchQuery(person.fullName)
      setShowResults(false)
    },
    [form],
  )

  const handleClearReceiver = useCallback(() => {
    setSearchQuery('')
    form.setValue('receiverId', '')
    setShowResults(false)
  }, [form])

  return {
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
  }
}
