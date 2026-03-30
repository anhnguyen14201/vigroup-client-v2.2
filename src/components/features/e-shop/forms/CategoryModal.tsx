'use client'

import { Button, Input, Textarea } from '@/components/ui'
import { LayoutGrid, Loader2, X, CheckCircle2, ShieldCheck } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import { categoryService } from '@/services'
import { toast } from 'sonner'
import { LanguageSwitcher, RichTextEditor } from '@/components/shared'
import TranslatableSEOInput from '@/components/features/e-shop/components/TranslatableSEOInput'
import nProgress from 'nprogress'

const CategoryModal = ({ data, onClose, languagesData, activeLang }: any) => {
  const isEdit = !!data
  const { refreshCats } = useProductManagement(10)

  const parseInitialTranslations = (data: any, languagesData: any) => {
    const initialMap: any = {}
    if (data?.translations) {
      data.translations.forEach((t: any) => {
        const langCode = languagesData.find(
          (l: any) => l._id === (t.language?._id || t.language),
        )?.code
        if (langCode) {
          initialMap[langCode] = {
            name: t.name || '',
            metaDescription: t.metaDescription || '',
            warrantyTerms: t.warrantyTerms || '',
          }
        }
      })
    }
    return initialMap
  }

  // --- STATE ---
  const [modalLang, setModalLang] = useState(activeLang)
  const [translationsMap, setTranslationsMap] = useState<any>(
    parseInitialTranslations(data, languagesData),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentTranslation = translationsMap[modalLang] || {
    name: '',
    metaDescription: '',
    warrantyTerms: '',
  }

  // --- HANDLERS ---
  const onTranslationChange = (field: string, value: string) => {
    setTranslationsMap((prev: any) => ({
      ...prev,
      [modalLang]: {
        ...(prev[modalLang] || {
          name: '',
          metaDescription: '',
          warrantyTerms: '',
        }),
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    nProgress.start()

    const processRequest = async () => {
      const translationsPayload = Object.keys(translationsMap)
        .map(langCode => {
          const langId = languagesData.find(
            (l: any) => l.code === langCode,
          )?._id
          return {
            language: langId,
            name: translationsMap[langCode].name,
            metaDescription: translationsMap[langCode].metaDescription,
            warrantyTerms: translationsMap[langCode].warrantyTerms, // Thêm vào payload
          }
        })
        .filter(t => t.language && t.name)

      const finalPayload = { translations: translationsPayload }
      const targetId = data?._id || data?.id

      const res = isEdit
        ? await categoryService.updateCategory(targetId, finalPayload)
        : await categoryService.createCategory(finalPayload)

      refreshCats()
      nProgress.done()
      if (res) onClose()
      return res
    }

    toast.promise(processRequest(), {
      loading: isEdit
        ? 'Đang cập nhật danh mục...'
        : 'Đang tạo danh mục mới...',
      success: 'Thành công!',
      error: err => {
        setIsSubmitting(false)
        return err.response?.data?.message || 'Có lỗi xảy ra'
      },
    })
  }

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{
          duration: 0.2, // Tổng thời gian chạy chỉ 0.2s
          ease: [0.16, 1, 0.3, 1], // Đường cong chuẩn Apple (Quartic Out)
        }}
        className='relative bg-[#F8FAFC] w-full max-w-3xl max-h-[90vh] rounded-[48px] 
                  flex flex-col shadow-2xl border border-white overflow-hidden'
      >
        {/* HEADER */}
        <div className='p-7 border-b border-slate-100 bg-white z-10'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-indigo-50 rounded-2xl text-indigo-600'>
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className='text-lg font-black uppercase italic text-slate-900 leading-tight'>
                  {isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục chính'}
                </h2>
                <p className='text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1'>
                  Đang soạn thảo:{' '}
                  <span className='text-indigo-600'>{modalLang}</span>
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <LanguageSwitcher
                languagesData={languagesData}
                currentLang={modalLang}
                onLangChange={setModalLang}
              />
              <button
                onClick={onClose}
                className='p-2.5 bg-slate-50 rounded-full hover:text-rose-500'
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className='flex-1 overflow-y-auto p-8 no-scrollbar space-y-8'>
          <form
            id='category-form'
            onSubmit={handleSubmit}
            className='space-y-10'
          >
            {/* Section 1: Thông tin SEO */}
            <div className='relative group'>
              <TranslatableSEOInput
                label='Thông tin định danh'
                langCode={modalLang}
                nameValue={currentTranslation.name}
                descValue={currentTranslation.metaDescription}
                onNameChange={val => onTranslationChange('name', val)}
                onDescChange={val =>
                  onTranslationChange('metaDescription', val)
                }
              />
            </div>

            {/* Section 2: Rich Text Area */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between px-4'>
                <div className='flex items-center gap-2.5'>
                  <div className='p-1.5 bg-indigo-50 rounded-lg text-indigo-600'>
                    <ShieldCheck size={16} />
                  </div>
                  <span className='text-[12px] font-bold text-slate-700 uppercase tracking-wide'>
                    Điều kiện bảo hành
                  </span>
                </div>
              </div>

              <RichTextEditor
                key={`warranty-${modalLang}`}
                value={currentTranslation.warrantyTerms || ''}
                onChange={val => onTranslationChange('warrantyTerms', val)}
                placeholder='Mô tả chi tiết các chính sách bảo hành dành cho khách hàng...'
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className='p-7 border-t border-slate-100 bg-white'>
          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              form='category-form'
              disabled={isSubmitting}
              className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-indigo-100'
            >
              {isSubmitting ? (
                <Loader2 className='animate-spin' />
              ) : isEdit ? (
                'Lưu thay đổi'
              ) : (
                'Xác nhận tạo mới'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CategoryModal
