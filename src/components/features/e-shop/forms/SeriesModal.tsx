'use client'

import { ProjectImageSection } from '@/components/features/project/forms'
import { Button, Input, Textarea } from '@/components/ui'
import { LayoutGrid, Loader2, X, Smartphone, CheckCircle2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import { seriesService } from '@/services'
import { toast } from 'sonner'
import { LanguageSwitcher } from '@/components/shared'
import CategoryItem from '@/components/features/e-shop/components/CategoryItem'
import nProgress from 'nprogress'

interface SeriesModalProps {
  data?: any
  onClose: () => void
  languagesData: any[]
  activeLang: string
  categories: any[]
  filteredSubCats: any[]
  brands: any[]
}

const SeriesModal = ({
  data,
  onClose,
  languagesData,
  activeLang,
  categories,
  filteredSubCats,
  brands,
}: SeriesModalProps) => {
  const isEdit = !!data
  const { refreshSeries, getTranslation } = useProductManagement(10)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- STATE ---
  const [modalLang, setModalLang] = useState(activeLang)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [translationsMap, setTranslationsMap] = useState<any>({})
  const [parentIds, setParentIds] = useState<string[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [images, setImages] = useState<any[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    if (isEdit && data) {
      const initialMap: any = {}

      // 1. Xử lý bản dịch
      languagesData.forEach((lang: any) => {
        // Tìm bản dịch tương ứng trong mảng translations
        const t = data.translations?.find(
          (trans: any) => (trans.language?._id || trans.language) === lang._id,
        )

        initialMap[lang.code] = {
          // Lấy seriesName từ root nếu là tiếng Việt/mặc định, hoặc lấy từ translation nếu có
          name: t?.name || data.seriesName || '',
          metaDescription: t?.metaDescription || '',
        }
      })
      setTranslationsMap(initialMap)

      // 2. Xử lý Categories & SubCategories (Gộp chung vào parentIds)
      const linkedCats = data.brand?.categories || [] // Hoặc data.categories nếu có ở root
      const linkedSubCats =
        data.subCategories?.map((s: any) => s._id || s) || []
      setParentIds([...linkedCats, ...linkedSubCats])

      // 3. Xử lý Thương hiệu
      setSelectedBrandId(data.brand?._id || data.brand || '')

      // 4. Xử lý Ảnh (Sửa từ data.image thành data.icon)
      const displayIcon = data.icon || data.image
      if (displayIcon) {
        setImages([
          {
            id: 'existing',
            url:
              typeof displayIcon === 'string' ? displayIcon : displayIcon.url,
            isThumbnail: true,
          },
        ])
      }
    }
  }, [data, isEdit, languagesData])

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

  const toggleParentSelection = (id: string) => {
    setParentIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    )
  }

  const toggleBrandSelection = (id: string) => {
    setSelectedBrandId(prev => (prev === id ? '' : id))
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // 1. Nếu đã có ảnh cũ, cần xử lý dọn dẹp trước khi thay thế
    if (images.length > 0) {
      images.forEach(img => {
        // Nếu là ảnh vừa mới chọn (có blob url), xóa để tránh tràn bộ nhớ
        if (img.file) {
          URL.revokeObjectURL(img.url)
        }
        // Nếu là ảnh cũ từ server, đưa vào danh sách cần xóa trên B2
        else {
          setRemovedImages(prev => [...prev, img.url])
        }
      })
    }

    // 2. Tạo object ảnh mới
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file: file,
      isThumbnail: true,
    }))

    // 3. THAY THẾ HOÀN TOÀN (Không dùng spread ...prev)
    setImages(newImages)

    // Reset giá trị input để có thể chọn lại cùng một file nếu muốn
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onRemoveImage = (idx: number) => {
    const target = images[idx]
    if (target?.url && !target.file) setRemovedImages(r => [...r, target.url])
    if (target?.file) URL.revokeObjectURL(target.url)
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    nProgress.start()
    // 1. Lấy seriesName: Ưu tiên lấy từ bản dịch Tiếng Việt hoặc ngôn ngữ hiện tại
    const seriesName = translationsMap[modalLang]?.name || data?.seriesName

    // Validate
    if (!seriesName?.trim())
      return toast.error('Vui lòng nhập tên dòng sản phẩm')
    if (!selectedBrandId) return toast.error('Vui lòng chọn Thương hiệu')

    // Lọc lấy danh sách ID thực sự là subCategory
    const subCatIds = parentIds.filter(id =>
      filteredSubCats.some(s => s._id === id),
    )
    if (subCatIds.length === 0)
      return toast.error('Vui lòng chọn ít nhất 1 Danh mục con')

    setIsSubmitting(true)

    const processRequest = async () => {
      const formData = new FormData()

      // A. Các trường text đơn
      formData.append('seriesName', seriesName.trim())
      formData.append('brand', selectedBrandId)

      // B. Mảng SubCategories (JSON string)
      formData.append('subCategories', JSON.stringify(subCatIds))

      // C. Mảng Translations (Chỉ gửi metaDescription theo Schema)
      const translations = Object.keys(translationsMap)
        .map(langCode => ({
          language: languagesData.find(l => l.code === langCode)?._id,
          metaDescription: translationsMap[langCode].metaDescription || '',
        }))
        .filter(t => t.language)
      formData.append('translations', JSON.stringify(translations))

      // D. Xử lý Icon (Sử dụng key 'icon' để khớp với Backend)
      if (images.length > 0) {
        const targetImg = images[0]
        if (targetImg.file) {
          // Nếu là file mới upload
          formData.append('icon', targetImg.file)
        } else if (targetImg.url) {
          // Nếu là ảnh cũ, backend sẽ giữ nguyên thông qua logic updateBody.icon
          formData.append('icon', targetImg.url)
        }
      }

      // E. Gọi API
      const res = isEdit
        ? await seriesService.updateSeries(data._id, formData)
        : await seriesService.createSeries(formData)

      refreshSeries()
      nProgress.done()
      onClose()

      return res
    }

    toast.promise(processRequest(), {
      loading: isEdit ? 'Đang cập nhật...' : 'Đang tạo dòng sản phẩm...',
      success: 'Thành công!',
      error: err => {
        setIsSubmitting(false)
        return err.response?.data?.message || 'Có lỗi xảy ra'
      },
    })
  }

  const currentTranslation = translationsMap[modalLang] || {
    name: '',
    metaDescription: '',
  }
  const seoLength = currentTranslation.metaDescription?.length || 0

  return (
    <div className='fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='relative bg-white w-full max-w-7xl rounded-[40px] flex flex-col border border-slate-100 overflow-hidden max-h-[95vh] shadow-2xl'
      >
        {/* HEADER */}
        <div className='p-5 sm:p-7 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 bg-amber-50 rounded-xl text-amber-600'>
              <Smartphone size={22} />
            </div>
            <div>
              <h2 className='text-base sm:text-lg font-black uppercase italic text-slate-900'>
                {isEdit ? 'Cập nhật Series' : 'Thêm Series'}
              </h2>
              <p className='text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest'>
                Ngôn ngữ: <span className='text-amber-600'>{modalLang}</span>
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 sm:gap-3'>
            <LanguageSwitcher
              languagesData={languagesData}
              currentLang={modalLang}
              onLangChange={setModalLang}
            />
            <button
              onClick={onClose}
              className='p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors'
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className='flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar'>
          <form id='series-form' onSubmit={handleSubmit} className='space-y-8'>
            <div className='flex flex-col lg:grid lg:grid-cols-12 gap-8'>
              {/* CỘT TRÁI: INFO */}
              <div className='lg:col-span-4 space-y-6'>
                <section className='space-y-4'>
                  <div className='space-y-1.5'>
                    <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                      Tên hiển thị
                    </label>
                    <Input
                      required
                      value={currentTranslation.name || data?.seriesName || ''}
                      onChange={e =>
                        onTranslationChange('name', e.target.value)
                      }
                      className='h-12 bg-slate-50 rounded-full px-5 text-sm font-semibold focus:ring-2 ring-amber-500/20 transition-all'
                      placeholder='iPhone 15 Series...'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                      SEO Description
                    </label>
                    <div className='relative'>
                      <Textarea
                        value={currentTranslation.metaDescription}
                        onChange={e =>
                          onTranslationChange('metaDescription', e.target.value)
                        }
                        className='rounded-3xl bg-slate-50 min-h-30  
                        resize-none text-sm p-5 focus:ring-2 ring-amber-500/20 transition-all'
                        placeholder='Mô tả chuẩn SEO...'
                      />
                      <div className='absolute bottom-3 right-4 flex items-center gap-1.5'>
                        <span
                          className={`text-[9px] font-bold ${seoLength > 160 ? 'text-rose-500' : 'text-slate-400'}`}
                        >
                          {seoLength}/160
                        </span>
                        {seoLength >= 140 && seoLength <= 160 && (
                          <CheckCircle2
                            size={12}
                            className='text-emerald-500'
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className='p-4 bg-slate-50 rounded-3xl border'>
                  <ProjectImageSection
                    images={images}
                    fileInputRef={fileInputRef}
                    onFileChange={onFileChange}
                    onRemoveImage={onRemoveImage}
                    onSelectThumbnail={() => {}}
                    title='Ảnh đại diện'
                    multiple={false}
                  />
                </section>
              </div>

              {/* CỘT PHẢI: RELATIONS */}
              <div className='lg:col-span-8 space-y-4'>
                <div className='flex flex-col sm:grid sm:grid-cols-3 gap-4 h-auto lg:h-130'>
                  {/* BOX 1: CATEGORIES */}
                  <div className='flex flex-col h-75 sm:h-full rounded-3xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 bg-slate-50 border-b flex items-center gap-2 sticky top-0 z-10'>
                      <div className='w-1 h-3 bg-indigo-500 rounded-full' />
                      <span className='text-[10px] font-black uppercase text-slate-500'>
                        Danh mục chính
                      </span>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar'>
                      {categories.map(item => (
                        <CategoryItem
                          key={item._id}
                          item={item}
                          activeLang={modalLang}
                          getTranslation={getTranslation}
                          isSelected={parentIds.includes(item._id)}
                          onToggle={() => toggleParentSelection(item._id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* BOX 2: SUB-CATEGORIES */}
                  <div className='flex flex-col h-75 sm:h-full rounded-3xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 bg-slate-50 border-b flex items-center gap-2 sticky top-0 z-10'>
                      <div className='w-1 h-3 bg-rose-500 rounded-full' />
                      <span className='text-[10px] font-black uppercase text-slate-500'>
                        Danh mục con
                      </span>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar'>
                      {filteredSubCats
                        .filter(s => !s.parent)
                        .map(parentSub => (
                          <div key={parentSub._id} className='space-y-1.5'>
                            <CategoryItem
                              item={parentSub}
                              activeLang={modalLang}
                              variant='secondary'
                              getTranslation={getTranslation}
                              isSelected={parentIds.includes(parentSub._id)}
                              onToggle={() =>
                                toggleParentSelection(parentSub._id)
                              }
                            />
                            {filteredSubCats
                              .filter(
                                child =>
                                  (child.parent?._id || child.parent) ===
                                  parentSub._id,
                              )
                              .map(child => (
                                <div
                                  key={child._id}
                                  className='ml-4 pl-2 border-l border-slate-100'
                                >
                                  <CategoryItem
                                    item={child}
                                    activeLang={modalLang}
                                    variant='secondary'
                                    getTranslation={getTranslation}
                                    isSelected={parentIds.includes(child._id)}
                                    onToggle={() =>
                                      toggleParentSelection(child._id)
                                    }
                                    className='scale-[0.98] origin-left'
                                  />
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* BOX 3: BRANDS */}
                  <div className='flex flex-col h-75 sm:h-full rounded-3xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 bg-slate-50 border-b  flex items-center gap-2 sticky top-0 z-10'>
                      <div className='w-1 h-3 bg-amber-500 rounded-full' />
                      <span className='text-[10px] font-black uppercase text-amber-600'>
                        Thương hiệu
                      </span>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar'>
                      {brands.map(brand => (
                        <CategoryItem
                          key={brand._id}
                          item={brand}
                          activeLang={modalLang}
                          getTranslation={getTranslation}
                          isSelected={selectedBrandId === brand._id}
                          onToggle={() => toggleBrandSelection(brand._id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className='p-5 sm:p-7 border-t  border-slate-100 bg-white flex flex-row gap-3 sticky bottom-0 z-20'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase text-slate-400'
          >
            Hủy
          </Button>
          <Button
            type='submit'
            form='series-form'
            disabled={isSubmitting}
            className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase transition-all active:scale-95'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' size={18} />
            ) : isEdit ? (
              'Lưu thay đổi'
            ) : (
              'Tạo Series ngay'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default SeriesModal
