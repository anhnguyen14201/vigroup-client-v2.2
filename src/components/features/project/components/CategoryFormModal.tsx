'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, LayoutGrid, X } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { toast } from 'sonner'
import { projectTypeService } from '@/services'
import { Field, LanguageSwitcher } from '@/components/shared'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import nProgress from 'nprogress'

interface TranslationInput {
  language: string
  name: string
  metaDescription: string
}

const CategoryFormModal = () => {
  const {
    // Data
    languagesData,
    refreshProjectTypes,
    refreshAllProjectTypes,

    // Modal States & Handlers
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    selectedCategory,
    setSelectedCategory,
  } = useProjectContext()

  const [globalLang, setGlobalLang] = useState<string>('vi')
  const [formTranslations, setFormTranslations] = useState<
    Record<string, TranslationInput>
  >({})
  const [loading, setLoading] = useState(false)

  const isEdit = !!selectedCategory

  useEffect(() => {
    if (isCategoryModalOpen && languagesData.length > 0) {
      const initialForm: Record<string, TranslationInput> = {}
      languagesData.forEach((l: any) => {
        const existingTranslation = selectedCategory?.translations?.find(
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
  }, [isCategoryModalOpen, languagesData, selectedCategory])

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
    nProgress.start()

    setLoading(true)
    try {
      const payload = { translations }
      if (isEdit) {
        await projectTypeService.update(selectedCategory._id, payload)
        toast.success('Cập nhật thành công!')
      } else {
        await projectTypeService.create(payload)
        toast.success('Thêm mới thành công!')
      }
      await refreshProjectTypes()
      await refreshAllProjectTypes()

      setIsCategoryModalOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
      nProgress.done()
    }
  }

  return (
    <AnimatePresence>
      {isCategoryModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
          {/* Lớp phủ Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              setIsCategoryModalOpen(false)
              setSelectedCategory(null)
            }}
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
          />

          {/* Nội dung Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.2, // Tổng thời gian chạy chỉ 0.2s
              ease: [0.16, 1, 0.3, 1], // Đường cong chuẩn Apple (Quartic Out)
            }}
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
                onClick={() => {
                  setIsCategoryModalOpen(false)
                  setSelectedCategory(null)
                }}
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
                initial={{ opacity: 0, x: 5 }} // Giảm x xuống còn 5 để tránh cảm giác bị trượt quá dài
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className='space-y-5'
              >
                <div className='space-y-2'>
                  <Field label={`Tên kiểu dự án (${globalLang})`}>
                    <Input
                      value={formTranslations[globalLang]?.name || ''}
                      onFocus={e => e.target.select()}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder='Ví dụ: Xây dựng dân dụng...'
                      className='h-12 rounded-full bg-slate-50 border-none 
                                focus-visible:ring-1 focus-visible:ring-primary/50 
                                text-sm font-medium'
                    />
                  </Field>
                </div>

                <Field label='Mô tả ngắn cho SEO'>
                  <div className='relative'>
                    <Textarea
                      value={
                        formTranslations[globalLang]?.metaDescription || ''
                      }
                      onChange={e =>
                        handleInputChange('metaDescription', e.target.value)
                      }
                      onFocus={e => e.target.select()}
                      placeholder='Nhập mô tả chuẩn SEO (nên từ 150-160 ký tự)...'
                      className='rounded-2xl bg-slate-50 border-none min-h-20
                 resize-none text-sm pb-8' // Thêm padding bottom để không đè lên text đếm
                    />

                    {/* Bộ đếm ký tự SEO */}
                    <div className='absolute bottom-2 right-4 flex items-center gap-1.5'>
                      <span
                        className={`text-[10px] font-black tracking-tighter uppercase ${
                          (formTranslations[globalLang]?.metaDescription
                            ?.length || 0) > 160
                            ? 'text-rose-500'
                            : (formTranslations[globalLang]?.metaDescription
                                  ?.length || 0) >= 140
                              ? 'text-emerald-500'
                              : 'text-slate-400'
                        }`}
                      >
                        {formTranslations[globalLang]?.metaDescription
                          ?.length || 0}{' '}
                        / 160
                      </span>

                      {/* Icon gợi ý trạng thái */}
                      {(formTranslations[globalLang]?.metaDescription?.length ||
                        0) >= 140 &&
                        (formTranslations[globalLang]?.metaDescription
                          ?.length || 0) <= 160 && (
                          <CheckCircle2
                            size={10}
                            className='text-emerald-500'
                          />
                        )}
                    </div>
                  </div>

                  <p className='text-[9px] font-medium text-slate-400 mt-1 ml-2 italic'>
                    * Gợi ý: Độ dài tốt nhất là từ 150 đến 160 ký tự để hiển thị
                    tốt trên Google.
                  </p>
                </Field>
              </motion.div>
            </div>

            {/* Footer */}
            <div className='p-8 pt-0 flex gap-3'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsCategoryModalOpen(false)
                  setSelectedCategory(null)
                }}
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
