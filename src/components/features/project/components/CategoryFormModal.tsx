'use client'

import React, { useEffect, useState } from 'react'
import { LayoutGrid, X } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { toast } from 'sonner'
import { projectTypeService } from '@/services'
import { LanguageSwitcher } from '@/components/shared'
import { motion, AnimatePresence } from 'framer-motion'

interface TranslationInput {
  language: string
  name: string
  metaDescription: string
}

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  languagesData: any[]
  initialData?: any
  onSuccess?: () => void
}

const CategoryFormModal = ({
  isOpen,
  onClose,
  languagesData,
  initialData,
  onSuccess,
}: CategoryFormModalProps) => {
  const [globalLang, setGlobalLang] = useState<string>('vi')
  const [formTranslations, setFormTranslations] = useState<
    Record<string, TranslationInput>
  >({})
  const [loading, setLoading] = useState(false)

  const isEdit = !!initialData

  useEffect(() => {
    if (isOpen && languagesData.length > 0) {
      const initialForm: Record<string, TranslationInput> = {}
      languagesData.forEach((l: any) => {
        const existingTranslation = initialData?.translations?.find(
          (t: any) => t.language._id === l._id || t.language === l._id,
        )
        initialForm[l.code] = {
          language: l._id,
          name: existingTranslation?.name || '',
          metaDescription: existingTranslation?.metaDescription || '',
        }
      })
      setFormTranslations(initialForm)
    }
  }, [isOpen, languagesData, initialData])

  const handleInputChange = (field: keyof TranslationInput, value: string) => {
    setFormTranslations(prev => ({
      ...prev,
      [globalLang]: { ...prev[globalLang], [field]: value },
    }))
  }

  const handleSubmit = async () => {
    const translations = Object.values(formTranslations).filter(
      t => t.name.trim() !== '',
    )
    if (translations.length === 0)
      return toast.error('Vui lòng nhập ít nhất tên cho một ngôn ngữ!')

    setLoading(true)
    try {
      const payload = { translations }
      if (isEdit) {
        await projectTypeService.update(initialData._id, payload)
        toast.success('Cập nhật thành công!')
      } else {
        await projectTypeService.create(payload)
        toast.success('Thêm mới thành công!')
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
          {/* Lớp phủ Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
          />

          {/* Nội dung Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className='relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100'
          >
            {/* Header */}
            <div className='p-8 pb-0 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h2 className='text-xl font-black text-slate-900 uppercase tracking-tight'>
                    {isEdit ? 'Cập nhật loại dự án' : 'Thêm loại dự án'}
                  </h2>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                    Thông tin đa ngôn ngữ
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className='p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className='p-8 space-y-6'>
              <div className='flex justify-end'>
                <LanguageSwitcher
                  languagesData={languagesData}
                  currentLang={globalLang}
                  onLangChange={setGlobalLang}
                />
              </div>

              <motion.div
                key={globalLang} // Key giúp motion nhận diện chuyển tab ngôn ngữ
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-5'
              >
                <div className='space-y-2'>
                  <label className='text-[11px] font-bold text-slate-500 uppercase ml-2'>
                    Tên loại dự án ({globalLang})
                  </label>
                  <Input
                    value={formTranslations[globalLang]?.name || ''}
                    onFocus={e => e.target.select()}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder='Ví dụ: Xây dựng dân dụng...'
                    className='h-12 rounded-full bg-slate-50 border-none 
                              focus-visible:ring-1 focus-visible:ring-primary/50 
                              text-sm font-medium'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-[11px] font-bold text-slate-500 uppercase ml-2'>
                    Mô tả SEO
                  </label>
                  <Textarea
                    value={formTranslations[globalLang]?.metaDescription || ''}
                    onFocus={e => e.target.select()}
                    onChange={e =>
                      handleInputChange('metaDescription', e.target.value)
                    }
                    placeholder='Nhập mô tả ngắn cho công cụ tìm kiếm...'
                    className='rounded-2xl bg-slate-50 border-none focus-visible:ring-1 
                              focus-visible:ring-primary/50 min-h-30 text-sm 
                              font-medium p-4 resize-none'
                  />
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className='p-8 pt-0 flex gap-3'>
              <Button
                variant='outline'
                onClick={onClose}
                className='flex-1 h-12 rounded-full font-bold text-slate-500'
              >
                Hủy bỏ
              </Button>
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className='flex-1 h-12 rounded-full font-bold
                          transition-all active:scale-95'
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận lưu'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CategoryFormModal
