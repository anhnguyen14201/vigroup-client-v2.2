'use client'

import { ProjectImageSection } from '@/components/features/project/forms'
import { Button, Input, Textarea } from '@/components/ui'
import { LayoutGrid, Loader2, X, CheckCircle2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import { brandService } from '@/services'
import { toast } from 'sonner'
import { LanguageSwitcher } from '@/components/shared'
import CategoryItem from '@/components/features/e-shop/components/CategoryItem'
import nProgress from 'nprogress'

const BrandModal = ({
  data,
  onClose,
  languagesData,
  activeLang,
  categories,
  filteredSubCats,
}: any) => {
  const isEdit = !!data
  const { refreshBrands, getTranslation } = useProductManagement(10)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [modalLang, setModalLang] = useState(activeLang)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [translationsMap, setTranslationsMap] = useState<any>({})
  const [parentIds, setParentIds] = useState<string[]>([])
  const [images, setImages] = useState<any[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [brandName, setBrandName] = useState('')

  console.log(data)

  useEffect(() => {
    if (isEdit && data) {
      setBrandName(data.name || '')

      const initialMap: any = {}
      data.translations?.forEach((t: any) => {
        const langCode = languagesData.find(
          (l: any) => l._id === (t.language?._id || t.language),
        )?.code
        if (langCode) {
          initialMap[langCode] = {
            metaDescription: t.metaDescription || '',
          }
        }
      })
      setTranslationsMap(initialMap)

      const linkedCats = data.categories?.map((c: any) => c._id || c) || []
      const linkedSubCats =
        data.subCategories?.map((s: any) => s._id || s) || []
      setParentIds([...linkedCats, ...linkedSubCats])

      // Backend trả về mảng logoBrand
      if (data.logoBrand && data.logoBrand.length > 0) {
        setImages(
          data.logoBrand.map((url: string) => ({
            id: url,
            url: url,
            file: null, // Ảnh cũ không có file
            isThumbnail: true,
          })),
        )
      }
    }
  }, [data, isEdit, languagesData])

  const currentTranslation = translationsMap[modalLang] || {
    metaDescription: '',
  }
  const seoLength = currentTranslation.metaDescription?.length || 0

  const onTranslationChange = (field: string, value: string) => {
    setTranslationsMap((prev: any) => ({
      ...prev,
      [modalLang]: { ...(prev[modalLang] || {}), [field]: value },
    }))
  }

  const toggleSelection = (id: string) => {
    setParentIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    )
  }

  const toggleParentSelection = (id: string) => {
    setParentIds(prev => {
      const isSelecting = !prev.includes(id)

      if (isSelecting) {
        // Logic Chọn (như trên)
        const selectedItem = [...categories, ...filteredSubCats].find(
          item => item._id === id,
        )
        const parentId = selectedItem?.parent?._id || selectedItem?.parent
        return Array.from(
          new Set([...prev, id, ...(parentId ? [parentId] : [])]),
        )
      } else {
        // Logic Bỏ chọn: Bỏ chính nó VÀ tất cả những thằng có cha là chính nó
        const childrenIds = filteredSubCats
          .filter((c: any) => (c.parent?._id || c.parent) === id)
          .map((c: any) => c._id)

        return prev.filter(i => i !== id && !childrenIds.includes(i))
      }
    })
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
    if (!brandName.trim()) return toast.error('Vui lòng nhập tên thương hiệu')

    setIsSubmitting(true)
    nProgress.start()

    const processRequest = async () => {
      const formData = new FormData()
      const targetId = data?._id || data?.id

      if (isEdit && targetId) {
        formData.append('productBrandId', targetId)
        // Hoặc formData.append('productBrandId', targetId) tùy theo Backend bạn đặt tên field là gì
      }
      // 1. Name cơ bản (Backend dùng để tạo slug)
      formData.append('name', brandName.trim())

      // 2. Translations
      const translations = Object.keys(translationsMap)
        .map(langCode => ({
          language: languagesData.find((l: any) => l.code === langCode)?._id,
          metaDescription: translationsMap[langCode].metaDescription,
        }))
        .filter(t => t.language)
      formData.append('translations', JSON.stringify(translations))

      // 3. Phân loại Categories/SubCategories
      const categoryIds = parentIds.filter(id =>
        categories.some((c: any) => c._id === id),
      )
      const subCategoryIds = parentIds.filter(id =>
        filteredSubCats.some((s: any) => s._id === id),
      )

      formData.append('categories', JSON.stringify(categoryIds))
      formData.append('subCategories', JSON.stringify(subCategoryIds))

      // 4. Xử lý Ảnh (Field name phải là 'logo' theo Router)
      const existingImages: string[] = []
      images.forEach(img => {
        if (img.file) {
          formData.append('logo', img.file) // Gửi file mới
        } else {
          existingImages.push(img.url) // Giữ ảnh cũ
        }
      })

      // Gửi mảng ảnh cũ để Backend so sánh
      formData.append('existingImages', JSON.stringify(existingImages))

      // Gửi mảng ảnh đã xóa để Backend delete trên B2
      if (isEdit && removedImages.length > 0) {
        formData.append('removedImageUrls', JSON.stringify(removedImages))
      }

      const res = isEdit
        ? await brandService.updateBrand(targetId, formData)
        : await brandService.createBrand(formData)

      refreshBrands()
      nProgress.done()
      onClose()
      return res
    }

    toast.promise(processRequest(), {
      loading: isEdit ? 'Đang cập nhật...' : 'Đang tạo mới...',
      success: 'Thành công!',
      error: err => {
        setIsSubmitting(false)
        return err.response?.data?.message || 'Lỗi hệ thống'
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
        className='relative bg-white w-full max-w-6xl rounded-[40px] flex flex-col border border-slate-100 overflow-hidden max-h-[95vh] shadow-2xl'
      >
        {/* HEADER */}
        <div className='p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-rose-50 rounded-2xl text-rose-600'>
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className='text-lg font-black uppercase italic text-slate-900 leading-tight'>
                {isEdit ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu mới'}
              </h2>
              <p className='text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5'>
                Brand Editor /{' '}
                <span className='text-rose-600'>{modalLang}</span>
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <LanguageSwitcher
              languagesData={languagesData}
              currentLang={modalLang}
              onLangChange={setModalLang}
            />
            <button
              onClick={onClose}
              className='p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
          <form id='brand-form' onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid lg:grid-cols-12 gap-6'>
              {/* CỘT TRÁI */}
              <div className='lg:col-span-4 space-y-5'>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                    Tên thương hiệu
                  </label>
                  <Input
                    required
                    value={brandName}
                    autoFocus
                    onChange={e => setBrandName(e.target.value)}
                    onFocus={e => e.target.select()}
                    placeholder='VD: Apple, Samsung...'
                    className='h-12 rounded-full border px-5 text-sm bg-slate-50 font-semibold'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                    Mô tả SEO ({modalLang})
                  </label>
                  <div className='relative'>
                    <Textarea
                      value={currentTranslation.metaDescription}
                      onFocus={e => e.target.select()}
                      onChange={e =>
                        onTranslationChange('metaDescription', e.target.value)
                      }
                      className='rounded-3xl bg-slate-50 min-h-30 resize-none text-sm p-5 focus:ring-2 ring-rose-500/20'
                      placeholder='Mô tả thương hiệu để hiển thị trên Google...'
                    />
                    <div className='absolute bottom-4 right-5 flex items-center gap-1.5'>
                      <span
                        className={`text-[10px] font-bold ${seoLength > 160 ? 'text-rose-500' : 'text-slate-400'}`}
                      >
                        {seoLength}/160
                      </span>
                    </div>
                  </div>
                </div>

                <div className='pt-2'>
                  <div className='p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200'>
                    <ProjectImageSection
                      images={images}
                      fileInputRef={fileInputRef}
                      onFileChange={onFileChange}
                      onRemoveImage={onRemoveImage}
                      onSelectThumbnail={() => {}} // Thương hiệu mặc định là thumbnail
                      title='Logo thương hiệu'
                      multiple={false}
                    />
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: RELATIONS */}
              <div className='lg:col-span-8'>
                <div className='grid lg:grid-cols-2 gap-4 h-112.5'>
                  <div className='flex flex-col rounded-4xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 border-b bg-white/50 text-[10px] font-black uppercase text-rose-500 flex items-center gap-2'>
                      <div className='w-1.5 h-3 bg-rose-500 rounded-full' /> Áp
                      dụng cho Danh mục chính
                    </div>
                    <div className='flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar'>
                      {categories.map((cat: any) => (
                        <CategoryItem
                          key={cat._id}
                          item={cat}
                          activeLang={modalLang}
                          isSelected={parentIds.includes(cat._id)}
                          onToggle={() => toggleSelection(cat._id)}
                          getTranslation={getTranslation}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col rounded-4xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 border-b bg-white/50 text-[10px] font-black uppercase text-slate-500 flex items-center gap-2'>
                      <div className='w-1.5 h-3 bg-slate-400 rounded-full' />{' '}
                      Chi tiết Danh mục con
                    </div>
                    <div className='flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar'>
                      {filteredSubCats
                        .filter((s: any) => !s.parent)
                        .map((parentSub: any) => (
                          <div key={parentSub._id} className='space-y-1'>
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
                                (c: any) =>
                                  (c.parent?._id || c.parent) === parentSub._id,
                              )
                              .map((child: any) => (
                                <div
                                  key={child._id}
                                  className='ml-4 pl-2 border-l border-slate-200'
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
                                    className='scale-95 origin-left'
                                  />
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className='p-6 border-t border-slate-100 flex gap-3 bg-white shrink-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='h-12 flex-1 rounded-2xl font-black text-[10px] uppercase'
          >
            Hủy bỏ
          </Button>
          <Button
            type='submit'
            form='brand-form'
            disabled={isSubmitting}
            className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase transition-all'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : isEdit ? (
              'Lưu thay đổi'
            ) : (
              'Xác nhận tạo'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default BrandModal
