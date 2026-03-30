'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'
import { useMaterialContext } from '@/components/features/materials/hooks'

const formSchema = z.object({
  totalAmount: z.string().min(1, 'Nhập số tiền'),
  invoiceGroup: z.string(),
  paymentMethod: z.string(),
  purchasePlace: z.string().min(1, 'Nhập nơi mua'),
  projectId: z.string().min(1, 'Chọn dự án'),
  createdAt: z.date(),
  note: z.string().optional(),
})

export type InvoiceFormValues = z.infer<typeof formSchema>

interface InvoiceImage {
  id: string
  url: string
  file?: File
  isOld: boolean
}

const createImageId = (file?: File, url?: string) => {
  if (url) return url
  return `${file?.name}-${file?.size}-${crypto.randomUUID()}`
}

export const useInvoiceForm = () => {
  const {
    projects,
    isModalOpen,
    closeInvoiceModal,
    selectedInvoice: initialData,
    refreshInvoices,
  } = useMaterialContext()

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<InvoiceImage[]>([])
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createdObjectUrlsRef = useRef<Set<string>>(new Set())

  const isEdit = !!initialData?._id

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalAmount: '0',
      invoiceGroup: 'materials',
      paymentMethod: 'cash',
      purchasePlace: '',
      projectId: '',
      createdAt: new Date(),
      note: '',
    },
  })

  // Cleanup bộ nhớ Blob
  const cleanupObjectUrls = useCallback(() => {
    createdObjectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    createdObjectUrlsRef.current.clear()
  }, [])

  // Reset form & states
  const resetStates = useCallback(() => {
    cleanupObjectUrls()
    setImages([])
    setRemovedImageUrls([])
    form.reset({
      totalAmount: '0',
      invoiceGroup: 'materials',
      paymentMethod: 'cash',
      purchasePlace: '',
      projectId: '',
      createdAt: new Date(),
      note: '',
    })
  }, [cleanupObjectUrls, form])

  // Đồng bộ dữ liệu khi đóng/mở modal
  useEffect(() => {
    if (!isModalOpen) {
      cleanupObjectUrls()
      return
    }

    if (isEdit && initialData) {
      form.reset({
        totalAmount: initialData.totalPayment?.toString() || '',
        invoiceGroup: initialData.invoiceGroup || 'materials',
        paymentMethod: initialData.paymentMethod || 'cash',
        purchasePlace: initialData.purchasePlace || '',
        projectId: initialData.project?._id || initialData.projIds?.[0] || '',
        createdAt: initialData.paymentDate
          ? new Date(initialData.paymentDate)
          : new Date(),
        note: initialData.note || '',
      })

      if (initialData.invoiceImages) {
        setImages(
          initialData.invoiceImages.map((url: string) => ({
            id: url,
            url,
            isOld: true,
          })),
        )
      }
      setRemovedImageUrls([])
    } else {
      resetStates()
    }
  }, [isModalOpen, initialData, isEdit, resetStates, cleanupObjectUrls])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      const newImages = files.map(file => {
        const url = URL.createObjectURL(file)
        createdObjectUrlsRef.current.add(url)
        return {
          id: createImageId(file),
          url,
          file,
          isOld: false,
        }
      })

      setImages(prev => [...prev, ...newImages])
      e.target.value = ''
    },
    [],
  )

  const removeFile = useCallback((idx: number) => {
    setImages(prev => {
      const target = prev[idx]
      const newImages = prev.filter((_, i) => i !== idx)

      if (target.isOld) {
        setRemovedImageUrls(old => [...old, target.url])
      } else {
        URL.revokeObjectURL(target.url)
        createdObjectUrlsRef.current.delete(target.url)
      }
      return newImages
    })
  }, [])

  const onSubmit = async (values: InvoiceFormValues) => {
    setLoading(true)
    nProgress.start()

    // 1. Khởi tạo Toast Loading và lưu lại ID
    const toastId = toast.loading(
      isEdit ? 'Đang cập nhật hóa đơn...' : 'Đang tạo hóa đơn mới...',
    )

    try {
      const formData = new FormData()
      formData.append('projectId', values.projectId)
      formData.append('totalPayment', values.totalAmount)
      formData.append('purchasePlace', values.purchasePlace)
      formData.append('paymentMethod', values.paymentMethod)
      formData.append('invoiceGroup', values.invoiceGroup)
      formData.append('paymentDate', values.createdAt.toISOString())
      formData.append('note', values.note || '')

      const existingImages: string[] = []

      images.forEach(img => {
        if (img.isOld) {
          existingImages.push(img.url)
        } else if (img.file) {
          formData.append('invoiceImages', img.file)
        }
      })

      formData.append('existingImages', JSON.stringify(existingImages))

      if (isEdit && removedImageUrls.length > 0) {
        formData.append('removedImageUrls', JSON.stringify(removedImageUrls))
      }

      // 2. Gọi API
      const result = isEdit
        ? await purchaseInvoiceService.updatePurchaseInvoice(
            initialData._id,
            formData,
          )
        : await purchaseInvoiceService.createPurchaseInvoice(formData)

      // 3. Xử lý kết quả dựa trên toastId đã tạo
      if (result.success || result._id) {
        toast.success(
          isEdit ? 'Cập nhật hóa đơn thành công' : 'Thêm hóa đơn thành công',
          { id: toastId }, // Ghi đè lên cái loading cũ
        )
        closeInvoiceModal()
        refreshInvoices?.()
      } else {
        throw new Error(result.message || 'Lỗi xử lý hóa đơn')
      }
    } catch (error: any) {
      // 4. Cập nhật lỗi lên chính cái toast đó
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!'
      toast.error(errorMessage, { id: toastId })
      console.error('❌ Submit Invoice Error:', error)
    } finally {
      nProgress.done()
      setLoading(false)
    }
  }

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closeInvoiceModal()
    },
    [closeInvoiceModal],
  )

  return {
    form,
    loading,
    previews: images,
    fileInputRef,
    projects,
    isModalOpen,
    isEdit,
    handleFileChange,
    removeFile,
    onSubmit: form.handleSubmit(onSubmit),
    closeInvoiceModal,
    handleBackdropClick,
  }
}
