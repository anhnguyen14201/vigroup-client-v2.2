import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { quotationService } from '@/services'

export const quoteFormSchema = z.object({
  desc: z.string().min(1, 'Vui lòng nhập nội dung'),
  cost: z.string().min(1, 'Vui lòng nhập đơn giá'),
  quantity: z.string().min(1, 'Số lượng tối thiểu là 1'),
})

export type QuoteFormValues = z.infer<typeof quoteFormSchema>

export const useAddQuote = (
  isOpen: boolean,
  onClose: () => void,
  projectId: string,
  type: 'quotation' | 'extra',
  onRefresh?: () => void,
  editData?: any,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!editData

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: { desc: '', cost: '', quantity: '1' },
  })

  // Effect xử lý reset/populate form
  useEffect(() => {
    if (!isOpen) {
      form.reset({ desc: '', cost: '', quantity: '1' })
      return
    }

    if (isEdit) {
      form.reset({
        desc: editData.desc,
        cost: String(editData.cost),
        quantity: String(editData.quantity),
      })
    }
  }, [isOpen, isEdit, editData, form])

  const onSubmit = useCallback(
    async (values: QuoteFormValues) => {
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
        const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra'
        toast.error(errorMsg)
      } finally {
        setIsSubmitting(false)
        nProgress.done()
      }
    },
    [isEdit, editData?._id, projectId, type, onClose, onRefresh],
  )

  return {
    form,
    isSubmitting,
    isEdit,
    onSubmit,
  }
}
