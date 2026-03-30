'use client'

import { Button, Input, Textarea } from '@/components/ui'
import { LayoutGrid, Loader2, X, CheckCircle2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import { subCategoryService } from '@/services'
import { toast } from 'sonner'
import { LanguageSwitcher } from '@/components/shared'
import CategoryItem from '@/components/features/e-shop/components/CategoryItem'
import TranslatableSEOInput from '@/components/features/e-shop/components/TranslatableSEOInput'
import nProgress from 'nprogress'

const SubCategoryModal = ({
  data,
  onClose,
  languagesData,
  activeLang,
  categories,
  filteredSubCats,
}: any) => {
  const isEdit = !!data
  const { refreshSubCats, getTranslation } = useProductManagement(10)

  // --- INITIAL DATA PARSER ---
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

  // Quan hệ: SubCategory cần thuộc về ít nhất 1 Category chính và có thể có 1 Parent SubCategory
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    data?.categories?.map((c: any) => c._id || c) || [],
  )
  const [subParentId, setSubParentId] = useState<string>(
    data?.parent?._id || data?.parent || '',
  )

  const currentTranslation = translationsMap[modalLang] || {
    name: '',
    metaDescription: '',
  }
  const seoLength = currentTranslation.metaDescription?.length || 0

  // --- HANDLERS ---
  const onTranslationChange = (field: string, value: string) => {
    setTranslationsMap((prev: any) => ({
      ...prev,
      [modalLang]: {
        ...(prev[modalLang] || { name: '', metaDescription: '' }),
        [field]: value,
      },
    }))
  }

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategoryIds.length === 0) {
      return toast.error('Vui lòng chọn ít nhất một danh mục chính.')
    }

    nProgress.start()

    setIsSubmitting(true)

    const processRequest = async () => {
      const translationsPayload = Object.keys(translationsMap)
        .map(langCode => ({
          language: languagesData.find((l: any) => l.code === langCode)?._id,
          name: translationsMap[langCode].name,
          metaDescription: translationsMap[langCode].metaDescription,
        }))
        .filter(t => t.language && t.name)

      const finalPayload = {
        translations: translationsPayload,
        categories: selectedCategoryIds,
        parent: subParentId || null, // Nếu không chọn thì để null
      }

      const targetId = data?._id || data?.id
      const res = isEdit
        ? await subCategoryService.updateSubCategory(targetId, finalPayload)
        : await subCategoryService.createSubCategory(finalPayload)

      refreshSubCats()
      nProgress.done()
      if (res) onClose()
      return res
    }

    toast.promise(processRequest(), {
      loading: isEdit
        ? 'Đang cập nhật danh mục con...'
        : 'Đang tạo danh mục con...',
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
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='relative bg-white w-full max-w-6xl rounded-[40px] flex flex-col border border-slate-100 overflow-hidden max-h-[90vh]'
      >
        {/* HEADER */}
        <div className='p-7 border-b border-slate-100 bg-white z-10 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-amber-50 rounded-2xl text-amber-600'>
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className='text-lg font-black uppercase italic text-slate-900 leading-tight'>
                {isEdit ? 'Cập nhật Danh mục con' : 'Thêm Danh mục con'}
              </h2>
              <p className='text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1'>
                Ngôn ngữ: <span className='text-amber-600'>{modalLang}</span>
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

        {/* BODY */}
        <div className='flex-1 overflow-y-auto p-7 no-scrollbar'>
          <form
            id='sub-category-form'
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* CỘT TRÁI: THÔNG TIN DỊCH THUẬT */}
              <TranslatableSEOInput
                label='Tên danh mục con'
                langCode={modalLang}
                nameValue={currentTranslation.name}
                descValue={currentTranslation.metaDescription}
                onNameChange={val => onTranslationChange('name', val)}
                onDescChange={val =>
                  onTranslationChange('metaDescription', val)
                }
                placeholderName='Ví dụ: Máy Toàn Đạc Leica, Phụ Kiện...'
              />
              <div className='grid lg:grid-cols-2 gap-4 h-100 overflow-y-auto no-scrollbar'>
                {/* 1. CHỌN CATEGORY CHÍNH (GỐC) */}
                <div className='flex flex-col rounded-3xl border border-slate-100 bg-slate-50/30 overflow-hidden'>
                  <div className='p-3 border-b border-slate-100 bg-white/50 text-[10px] font-black uppercase text-indigo-500 flex items-center gap-2'>
                    <div className='w-1 h-3 bg-indigo-500 rounded-full' />
                    Danh mục chính (Cấp 1)
                  </div>
                  <div className='flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar'>
                    {categories.map((cat: any) => (
                      <CategoryItem
                        key={cat._id}
                        item={cat}
                        activeLang={modalLang}
                        getTranslation={getTranslation}
                        isSelected={selectedCategoryIds.includes(cat._id)}
                        onToggle={() => toggleCategory(cat._id)}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. CHỌN SUB-CATEGORY CHA (Để tạo cấp 2, cấp 3...) */}
                <div className='flex flex-col rounded-3xl border border-slate-100 bg-slate-50/30 overflow-hidden'>
                  <div className='p-3 border-b border-slate-100 bg-white/50 text-[10px] font-black uppercase text-amber-500 flex items-center gap-2'>
                    <div className='w-1 h-3 bg-amber-500 rounded-full' />
                    Thuộc nhóm con nào?
                  </div>
                  <div className='flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar'>
                    {filteredSubCats
                      // Chỉ lấy những Sub không có parent (đây là các Sub cấp 1)
                      .filter((s: any) => !s.parent && s._id !== data?._id)
                      .map((parentSub: any) => (
                        <React.Fragment key={parentSub._id}>
                          {/* Hiển thị Sub cha */}
                          <CategoryItem
                            item={parentSub}
                            activeLang={modalLang}
                            getTranslation={getTranslation}
                            isSelected={subParentId === parentSub._id}
                            onToggle={() =>
                              setSubParentId(
                                subParentId === parentSub._id
                                  ? ''
                                  : parentSub._id,
                              )
                            }
                            variant='secondary'
                          />

                          {/* Hiển thị các Sub con của parentSub này (Thụt lề) */}
                          {filteredSubCats
                            .filter(
                              (child: any) =>
                                (child.parent?._id || child.parent) ===
                                  parentSub._id && child._id !== data?._id,
                            )
                            .map((childSub: any) => (
                              <div
                                key={childSub._id}
                                className='ml-4 pl-3 border-l-2 border-amber-100'
                              >
                                <CategoryItem
                                  item={childSub}
                                  activeLang={modalLang}
                                  getTranslation={getTranslation}
                                  isSelected={subParentId === childSub._id}
                                  onToggle={() =>
                                    setSubParentId(
                                      subParentId === childSub._id
                                        ? ''
                                        : childSub._id,
                                    )
                                  }
                                  variant='secondary'
                                  className='scale-95 origin-left' // Làm nhỏ hơn một chút để phân cấp
                                />
                              </div>
                            ))}
                        </React.Fragment>
                      ))}

                    {filteredSubCats.length === 0 && (
                      <div className='text-[10px] text-slate-400 italic text-center mt-10'>
                        Chưa có danh mục con nào khác
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className='p-7 border-t border-slate-100 bg-white flex gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase'
          >
            Đóng
          </Button>
          <Button
            type='submit'
            form='sub-category-form'
            disabled={isSubmitting}
            className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase '
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : isEdit ? (
              'Cập nhật'
            ) : (
              'Xác nhận tạo mới'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default SubCategoryModal
