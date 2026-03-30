'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  brandService,
  categoryService,
  seriesService,
  subCategoryService,
} from '@/services'

export function useEntityModalForm({
  type,
  data,
  languagesData,
  activeLang,
  categories = [],
  filteredSubCats = [],
  onClose,
  refreshCats,
  refreshSubCats,
  refreshBrands,
  refreshSeries,
}: any) {
  const isEdit = !!data
  const [modalLang, setModalLang] = useState(activeLang)
  const [translationsMap, setTranslationsMap] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentIds, setParentIds] = useState<string[]>([])
  const [subParentId, setSubParentId] = useState<string>('')
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([])
  const [images, setImages] = useState<any[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createdUrls = useRef<Set<string>>(new Set())

  // --- LOGIC DỌN DẸP BLOB URL ---
  const cleanupUrls = useCallback(() => {
    createdUrls.current.forEach(url => URL.revokeObjectURL(url))
    createdUrls.current.clear()
  }, [])

  // --- INITIALIZATION ---
  useEffect(() => {
    if (!isEdit || !data) {
      setTranslationsMap({})
      setImages([])
      return
    }

    // Map dịch thuật
    const initialMap: any = {}
    data.translations?.forEach((t: any) => {
      const langId = t.language?._id || t.language
      const langCode = languagesData.find((l: any) => l._id === langId)?.code
      if (langCode) {
        initialMap[langCode] = {
          name: t.name,
          metaDescription: t.metaDescription,
        }
      }
    })
    setTranslationsMap(initialMap)

    // Map quan hệ cha-con
    const linkedCats = data.categories?.map((c: any) => c._id || c) || []
    const linkedSubCats = data.subCategories?.map((s: any) => s._id || s) || []

    if (type === 'SUB_CATEGORY') {
      if (linkedCats.length > 0) setParentIds([linkedCats[0]])
      if (data.parent) setSubParentId(data.parent._id || data.parent)
    } else {
      setParentIds([...linkedCats, ...linkedSubCats])
    }

    if (type === 'SERIES') {
      setSelectedBrandIds(data.brands?.map((b: any) => b._id || b) || [])
    }

    // Map ảnh
    if (data.image) {
      const imageUrl =
        typeof data.image === 'string' ? data.image : data.image.url
      setImages([{ id: 'existing', url: imageUrl, isThumbnail: true }])
    }

    return cleanupUrls // Cleanup khi unmount hoặc data thay đổi
  }, [data, isEdit, languagesData, type, cleanupUrls])

  // --- MEMOIZED VALUES ---
  const currentTranslation = useMemo(
    () => translationsMap[modalLang] || { name: '', metaDescription: '' },
    [translationsMap, modalLang],
  )

  // --- HANDLERS ---
  const onTranslationChange = useCallback(
    (field: string, value: string) => {
      setTranslationsMap((prev: any) => ({
        ...prev,
        [modalLang]: { ...(prev[modalLang] || {}), [field]: value },
      }))
    },
    [modalLang],
  )

  const toggleSelection = useCallback(
    (id: string, setState: any, isMultiple = true) => {
      setState((prev: any) => {
        if (isMultiple) {
          return prev.includes(id)
            ? prev.filter((i: any) => i !== id)
            : [...prev, id]
        }
        return prev === id ? '' : id
      })
    },
    [],
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      const newImages = files.map(file => {
        const url = URL.createObjectURL(file)
        createdUrls.current.add(url)
        return {
          id: Math.random().toString(36).substring(7),
          url,
          file,
          isThumbnail: images.length === 0,
        }
      })
      setImages(prev => [...prev, ...newImages])
    },
    [images.length],
  )

  const onRemoveImage = useCallback((idx: number) => {
    setImages(prev => {
      const target = prev[idx]
      const next = prev.filter((_, i) => i !== idx)
      if (target?.url && !target.file) setRemovedImages(r => [...r, target.url])
      if (target?.file) {
        URL.revokeObjectURL(target.url)
        createdUrls.current.delete(target.url)
      }
      if (target?.isThumbnail && next.length > 0) next[0].isThumbnail = true
      return next
    })
  }, [])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      setIsSubmitting(true)

      const actionText = isEdit ? 'Cập nhật' : 'Tạo mới'
      const objectMap: any = {
        CATEGORY: 'danh mục',
        SUB_CATEGORY: 'danh mục con',
        BRAND: 'thương hiệu',
        SERIES: 'dòng sản phẩm',
      }
      const objectText = objectMap[type] || 'thực thể'

      const processRequest = async () => {
        const formData = new FormData()

        // Xử lý dịch thuật
        const translations = Object.keys(translationsMap).map(langCode => ({
          language: languagesData.find((l: any) => l.code === langCode)?._id,
          name: translationsMap[langCode].name,
          metaDescription: translationsMap[langCode].metaDescription,
        }))
        formData.append('translations', JSON.stringify(translations))

        // Xử lý quan hệ
        const categoryIds = parentIds.filter(id =>
          categories.some((c: any) => c._id === id),
        )
        const subCategoryIds = parentIds.filter(id =>
          filteredSubCats.some((s: any) => s._id === id),
        )

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

        // Xử lý ảnh
        const existingImages: string[] = []
        let newFileCounter = 0
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

        const targetId = data?._id || data?.id
        let res

        // Routing service theo type
        const servicesMap: any = {
          CATEGORY: { service: categoryService, refresh: refreshCats },
          SUB_CATEGORY: {
            service: subCategoryService,
            refresh: refreshSubCats,
          },
          BRAND: { service: brandService, refresh: refreshBrands },
          SERIES: { service: seriesService, refresh: refreshSeries },
        }

        const current = servicesMap[type]
        const method = isEdit
          ? `update${type
              .split('_')
              .map((s: any) => s.charAt(0) + s.slice(1).toLowerCase())
              .join('')}`
          : `create${type
              .split('_')
              .map((s: any) => s.charAt(0) + s.slice(1).toLowerCase())
              .join('')}`

        // Đoạn này gọi service động theo logic hiện tại
        if (type === 'CATEGORY')
          res = isEdit
            ? await categoryService.updateCategory(targetId, formData)
            : await categoryService.createCategory(formData)
        else if (type === 'SUB_CATEGORY')
          res = isEdit
            ? await subCategoryService.updateSubCategory(targetId, formData)
            : await subCategoryService.createSubCategory(formData)
        else if (type === 'BRAND')
          res = isEdit
            ? await brandService.updateBrand(targetId, formData)
            : await brandService.createBrand(formData)
        else if (type === 'SERIES')
          res = isEdit
            ? await seriesService.updateSeries(targetId, formData)
            : await seriesService.createSeries(formData)

        current.refresh()
        if (res) {
          cleanupUrls()
          onClose()
        }
        return res
      }

      toast.promise(processRequest(), {
        loading: `Đang ${actionText.toLowerCase()} ${objectText}...`,
        success: `${actionText} ${objectText} thành công!`,
        error: (err: any) => {
          setIsSubmitting(false)
          return (
            err.response?.data?.message ||
            `Lỗi khi ${actionText.toLowerCase()}.`
          )
        },
      })
    },
    [
      isEdit,
      type,
      translationsMap,
      languagesData,
      parentIds,
      categories,
      filteredSubCats,
      subParentId,
      selectedBrandIds,
      images,
      removedImages,
      data?._id,
      data?.id,
      refreshCats,
      refreshSubCats,
      refreshBrands,
      refreshSeries,
      onClose,
      cleanupUrls,
    ],
  )

  // --- RETURN MEMOIZED API ---
  return useMemo(
    () => ({
      modalLang,
      setModalLang,
      translationsMap,
      currentTranslation,
      isSubmitting,
      setIsSubmitting,
      parentIds,
      setParentIds,
      subParentId,
      setSubParentId,
      selectedBrandIds,
      setSelectedBrandIds,
      images,
      setImages,
      removedImages,
      fileInputRef,
      onTranslationChange,
      toggleSelection,
      onFileChange,
      onRemoveImage,
      handleSubmit,
      isEdit,
    }),
    [
      modalLang,
      translationsMap,
      currentTranslation,
      isSubmitting,
      parentIds,
      subParentId,
      selectedBrandIds,
      images,
      removedImages,
      isEdit,
      onTranslationChange,
      toggleSelection,
      onFileChange,
      onRemoveImage,
      handleSubmit,
    ],
  )
}
