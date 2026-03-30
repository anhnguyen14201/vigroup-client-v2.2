import { ProjectImageSection } from '@/components/features/project/forms'
import { Button, Input, Textarea } from '@/components/ui'
import { LayoutGrid, Loader2, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import {
  brandService,
  categoryService,
  seriesService,
  subCategoryService,
} from '@/services'
import CategoryItem from '@/components/features/e-shop/components/CategoryItem'
import { toast } from 'sonner'
import { LanguageSwitcher } from '@/components/shared'

const QuickAddModal = ({
  type: modalConfig,
  onClose,
  languagesData,
  filteredSubCats,
  categories,
  activeLang,
  brands,
}: any) => {
  const { type, data } = modalConfig
  const isEdit = !!data

  const {
    refreshCats,
    refreshSubCats,
    refreshBrands,
    refreshSeries,
    getTranslation,
  } = useProductManagement(10)

  // --- STATE ---
  const [modalLang, setModalLang] = useState(activeLang)
  const [translationsMap, setTranslationsMap] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentIds, setParentIds] = useState<string[]>([])
  const [subParentId, setSubParentId] = useState<string>('')
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([])
  const [images, setImages] = useState<any[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- COMPUTED ---
  const titles: Record<string, string> = {
    CATEGORY: isEdit ? 'Cập nhật Danh mục' : 'Thêm Danh mục chính',
    SUB_CATEGORY: isEdit ? 'Cập nhật Danh mục con' : 'Thêm Danh mục con',
    BRAND: isEdit ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu',
    SERIES: isEdit ? 'Cập nhật Dòng sản phẩm' : 'Thêm Dòng sản phẩm',
  }

  const objectText = titles[type]?.toLowerCase() || 'mục'
  // Tìm đến dòng này và sửa thành:
  const currentTranslation = translationsMap[modalLang] || {
    name: '',
    metaDescription: '',
  }
  // --- EFFECTS (Giữ nguyên logic) ---
  useEffect(() => {
    if (isEdit && data.translations) {
      const initialMap: any = {}
      data.translations.forEach((t: any) => {
        const langCode = languagesData.find(
          (l: any) => l._id === (t.language?._id || t.language),
        )?.code
        if (langCode)
          initialMap[langCode] = {
            name: t.name,
            metaDescription: t.metaDescription,
          }
      })
      setTranslationsMap(initialMap)

      const linkedCats = data.categories?.map((c: any) => c._id || c) || []
      const linkedSubCats =
        data.subCategories?.map((s: any) => s._id || s) || []

      if (type === 'SUB_CATEGORY') {
        if (linkedCats.length > 0) setParentIds([linkedCats[0]])
        if (data.parent) setSubParentId(data.parent._id || data.parent)
      } else {
        setParentIds([...linkedCats, ...linkedSubCats])
      }

      if (type === 'SERIES') {
        setSelectedBrandIds(data.brands?.map((b: any) => b._id || b) || [])
      }

      if (data.image) {
        setImages([
          {
            id: 'existing',
            url: typeof data.image === 'string' ? data.image : data.image.url,
            isThumbnail: true,
          },
        ])
      }
    }
  }, [data, isEdit, languagesData, type])

  // --- HANDLERS (Giữ nguyên logic) ---
  const onTranslationChange = (field: string, value: string) => {
    setTranslationsMap((prev: any) => {
      // Lấy dữ liệu cũ của ngôn ngữ hiện tại, nếu chưa có thì lấy mặc định trống
      const prevLangData = prev[modalLang] || { name: '', metaDescription: '' }

      return {
        ...prev,
        [modalLang]: {
          ...prevLangData,
          [field]: value,
        },
      }
    })
  }

  const toggleSelection = (
    id: string,
    state: any[],
    setState: any,
    isMultiple = true,
  ) => {
    if (isMultiple) {
      setState((prev: any) =>
        prev.includes(id) ? prev.filter((i: any) => i !== id) : [...prev, id],
      )
    } else {
      setState((prev: any) => (prev === id ? '' : id))
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file: file,
      isThumbnail: images.length === 0,
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const onRemoveImage = (idx: number) => {
    setImages(prev => {
      const target = prev[idx]
      const next = prev.filter((_, i) => i !== idx)
      if (target?.url && !target.file) setRemovedImages(r => [...r, target.url])
      if (target?.file) URL.revokeObjectURL(target.url)
      if (target?.isThumbnail && next.length > 0) next[0].isThumbnail = true
      return next
    })
  }

  const seoLength = currentTranslation.metaDescription?.length || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const actionText = isEdit ? 'Cập nhật' : 'Tạo mới'

    const processRequest = async () => {
      // 1. Chuẩn bị dữ liệu JSON sạch
      const translations = Object.keys(translationsMap)
        .map(langCode => ({
          language: languagesData.find((l: any) => l.code === langCode)?._id,
          name: translationsMap[langCode].name,
          metaDescription: translationsMap[langCode].metaDescription,
        }))
        .filter(t => t.language) // Loại bỏ lang không hợp lệ

      const categoryIds = parentIds.filter(id =>
        categories.some((c: any) => c._id === id),
      )
      const subCategoryIds = parentIds.filter(id =>
        filteredSubCats.some((s: any) => s._id === id),
      )

      // 2. Kiểm tra xem có cần gửi file không
      const hasFiles = images.some(img => img.file)
      const isTypeWithImage = type === 'BRAND' || type === 'SERIES'

      let payload: any

      if (isTypeWithImage || hasFiles) {
        // --- DÙNG FORMDATA (Cho Brand/Series hoặc khi có upload ảnh) ---
        const formData = new FormData()
        formData.append('translations', JSON.stringify(translations))

        // Thêm quan hệ
        if (type === 'SUB_CATEGORY') {
          formData.append('categories', JSON.stringify(categoryIds))
          formData.append('parent', subParentId)
        } else if (type === 'BRAND') {
          formData.append('categories', JSON.stringify(categoryIds))
          formData.append('subCategories', JSON.stringify(subCategoryIds))
        } else if (type === 'SERIES') {
          formData.append('brands', JSON.stringify(selectedBrandIds))
          formData.append('categories', JSON.stringify(categoryIds))
          formData.append('subCategories', JSON.stringify(subCategoryIds))
        }

        // Xử lý ảnh (giữ nguyên logic cũ của bạn)
        let newFileCounter = 0
        const existingImages: string[] = []
        const thumbnailIndexes: number[] = []

        images.forEach(img => {
          if (img.file) {
            formData.append('images', img.file)
            if (img.isThumbnail) thumbnailIndexes.push(newFileCounter)
            newFileCounter++
          } else {
            existingImages.push(img.url)
            if (img.isThumbnail) formData.append('existingThumbnail', img.url)
          }
        })

        formData.append('existingImages', JSON.stringify(existingImages))
        if (thumbnailIndexes.length > 0)
          formData.append('thumbnailIndexes', JSON.stringify(thumbnailIndexes))
        if (isEdit && removedImages.length > 0)
          formData.append('removedImageUrls', JSON.stringify(removedImages))

        payload = formData
      } else {
        // --- DÙNG JSON OBJECT (Cho Category/SubCategory không có ảnh) ---
        // Gửi thế này Backend sẽ nhận được Array chuẩn, không bị lỗi validation
        payload = {
          translations,
          categories: categoryIds,
          ...(type === 'SUB_CATEGORY' && {
            parent: subParentId || null,
            categories: categoryIds, // SubCategory thường chỉ thuộc 1 Category chính
          }),
          ...(type === 'BRAND' && { subCategories: subCategoryIds }),
          ...(type === 'SERIES' && {
            brands: selectedBrandIds,
            subCategories: subCategoryIds,
          }),
        }
      }

      // 3. Gọi Service với payload tương ứng
      const targetId = data?._id || data?.id
      let res

      // Lưu ý: Đảm bảo các hàm service của bạn (createCategory, v.v.)
      // có thể nhận cả FormData HOẶC Plain Object.
      // Axios sẽ tự động set Content-Type dựa trên payload.

      if (type === 'CATEGORY') {
        res = isEdit
          ? await categoryService.updateCategory(targetId, payload)
          : await categoryService.createCategory(payload)
        refreshCats()
      } else if (type === 'SUB_CATEGORY') {
        res = isEdit
          ? await subCategoryService.updateSubCategory(targetId, payload)
          : await subCategoryService.createSubCategory(payload)
        refreshSubCats()
      } else if (type === 'BRAND') {
        res = isEdit
          ? await brandService.updateBrand(targetId, payload)
          : await brandService.createBrand(payload)
        refreshBrands()
      } else if (type === 'SERIES') {
        res = isEdit
          ? await seriesService.updateSeries(targetId, payload)
          : await seriesService.createSeries(payload)
        refreshSeries()
      }

      if (res) onClose()
      return res
    }

    toast.promise(processRequest(), {
      loading: `Hệ thống đang ${actionText.toLowerCase()} ${objectText}...`,
      success: `${actionText} ${objectText} thành công!`,
      error: err => {
        setIsSubmitting(false)
        return (
          err.response?.data?.message || `Lỗi khi ${actionText.toLowerCase()}.`
        )
      },
    })
  }

  // --- RENDER HELPERS (Giữ nguyên logic) ---
  const renderCategoryColumn = (
    title: string,
    color: string,
    items: any[],
    isSubColumn = false,
  ) => (
    <div className='flex flex-col rounded-3xl border border-slate-100 bg-slate-50/30 overflow-hidden'>
      <div className='p-3 border-b border-slate-100 bg-white/50 flex items-center gap-2'>
        <div className={`w-1 h-3 ${color} rounded-full`} />
        <span className='text-[10px] font-bold text-slate-600 uppercase'>
          {title}
        </span>
      </div>
      <div className='flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar'>
        {items.map((item: any) => {
          if (isSubColumn) {
            const isGrandChild = filteredSubCats.some(
              (s: any) => s._id === (item.parent?._id || item.parent),
            )
            if (isGrandChild) return null
          }
          const isSelected =
            type === 'SUB_CATEGORY' && isSubColumn
              ? subParentId === item._id
              : parentIds.includes(item._id)
          return (
            <React.Fragment key={item._id}>
              <CategoryItem
                item={item}
                activeLang={modalLang}
                getTranslation={getTranslation}
                isSelected={isSelected}
                onToggle={() =>
                  isSubColumn && type === 'SUB_CATEGORY'
                    ? toggleSelection(item._id, [], setSubParentId, false)
                    : toggleSelection(item._id, parentIds, setParentIds)
                }
                variant={isSubColumn ? 'secondary' : 'primary'}
              />
              {isSubColumn &&
                filteredSubCats
                  .filter(
                    (child: any) =>
                      (child.parent?._id || child.parent) === item._id &&
                      child._id !== data?._id,
                  )
                  .map((child: any) => (
                    <div
                      key={child._id}
                      className='ml-5 pl-3 border-l-2 border-amber-100'
                    >
                      <CategoryItem
                        item={child}
                        activeLang={modalLang}
                        getTranslation={getTranslation}
                        isSelected={
                          type === 'SUB_CATEGORY'
                            ? subParentId === child._id
                            : parentIds.includes(child._id)
                        }
                        onToggle={() =>
                          type === 'SUB_CATEGORY'
                            ? toggleSelection(
                                child._id,
                                [],
                                setSubParentId,
                                false,
                              )
                            : toggleSelection(
                                child._id,
                                parentIds,
                                setParentIds,
                              )
                        }
                        variant='secondary'
                      />
                    </div>
                  ))}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className='relative bg-white w-full max-w-4xl rounded-[40px] flex flex-col border
             border-slate-100 overflow-hidden max-h-[90vh]'
      >
        {/* --- HEADER CỐ ĐỊNH --- */}
        <div className='shrink-0 p-7 border-b border-slate-100 bg-white z-10'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-indigo-50 rounded-2xl text-indigo-600'>
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className='text-lg font-black uppercase italic text-slate-900 leading-tight'>
                  {titles[type]}
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
                className='p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full'
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- NỘI DUNG CUỘN --- */}
        <div className='flex-1 overflow-y-auto p-7 custom-scrollbar'>
          <form
            id='quick-add-form'
            onSubmit={handleSubmit}
            className='space-y-6 pb-2'
          >
            {/* Input Tên & SEO */}
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-1.5'>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                  Tên hiển thị ({modalLang})
                </label>
                <Input
                  required
                  value={currentTranslation.name || ''}
                  onChange={e => onTranslationChange('name', e.target.value)}
                  placeholder='Nhập tên...'
                  className='h-11 bg-slate-50 border rounded-full px-4 text-sm font-semibold'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                  SEO Description ({modalLang})
                </label>
                <div className='relative'>
                  <Textarea
                    value={currentTranslation?.metaDescription || ''}
                    onChange={e =>
                      onTranslationChange('metaDescription', e.target.value)
                    }
                    className='rounded-2xl bg-slate-50 min-h-24 resize-none text-sm pb-10 border'
                  />
                  <div className='absolute bottom-3 right-4 text-[10px] font-black text-slate-400'>
                    {seoLength} / 160
                  </div>
                </div>
              </div>
            </div>

            {/* Relations Section */}
            {type !== 'CATEGORY' && (
              <div className='space-y-3'>
                <div
                  className={`grid ${type === 'SERIES' ? 'grid-cols-3' : 'grid-cols-2'} gap-4 h-[350px]`}
                >
                  {renderCategoryColumn('Cấp 1', 'bg-indigo-500', categories)}
                  {renderCategoryColumn(
                    'Cấp 2 & Phụ',
                    'bg-amber-500',
                    filteredSubCats.filter((s: any) => s._id !== data?._id),
                    true,
                  )}
                  {type === 'SERIES' &&
                    renderCategoryColumn('Thương hiệu', 'bg-rose-500', brands)}
                </div>
              </div>
            )}

            {/* Image Section */}
            {(type === 'BRAND' || type === 'SERIES') && (
              <div className='bg-slate-50/50 p-5 rounded-[32px] border border-slate-100'>
                <ProjectImageSection
                  images={images}
                  fileInputRef={fileInputRef}
                  onFileChange={onFileChange}
                  onSelectThumbnail={idx =>
                    setImages(prev =>
                      prev.map((img, i) => ({
                        ...img,
                        isThumbnail: i === idx,
                      })),
                    )
                  }
                  onRemoveImage={onRemoveImage}
                />
              </div>
            )}
          </form>
        </div>

        {/* --- FOOTER CỐ ĐỊNH --- */}
        <div className='shrink-0 p-7 border-t border-slate-100 bg-white'>
          <div className='flex gap-3'>
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
              form='quick-add-form' // Gắn ID form để nút Submit hoạt động khi nằm ngoài form
              disabled={isSubmitting}
              className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-indigo-100'
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
        </div>
      </motion.div>
    </div>
  )
}
export default QuickAddModal
