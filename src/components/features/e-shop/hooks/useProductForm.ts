import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { productService } from '@/services'
import { useProductManagement } from '@/components/features/e-shop/hooks'

export const useProductForm = (
  data: any,
  languagesData: any,
  activeLang: string,
  categories: any,
  filteredSubCats: any,
  onClose: () => void,
) => {
  const isEdit = !!data
  const { refreshProducts, getTranslation, products } = useProductManagement(10)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // --- STATE ---
  const [modalLang, setModalLang] = useState(activeLang || 'vi')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ensureArray = (val: any) => {
    if (!val) return [] // Nếu null/undefined trả về mảng rỗng
    if (Array.isArray(val)) return val // Nếu là mảng rồi thì giữ nguyên
    return [val] // Nếu là string hoặc object đơn lẻ, bọc nó vào mảng [val]
  }

  // Dữ liệu chung không phụ thuộc ngôn ngữ
  // --- STATE ---
  const [commonData, setCommonData] = useState({
    code: '',
    importPrice: 0,
    salePrice: 0,
    discountPrice: 0,
    quantity: 0,
    images: [] as any[],
    removedImages: [] as string[],
    unit: 'ks',
    tax: 21,
    isVisible: true,
    // Thêm 3 field mới ở đây
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    relatedProducts: [] as string[],
  })
  const [translationsMap, setTranslationsMap] = useState<Record<string, any>>(
    {},
  )
  const [parentIds, setParentIds] = useState<string[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('')

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    // Khởi tạo map ngôn ngữ trống dựa trên languagesData
    const initialMap: any = {}
    languagesData.forEach((lang: any) => {
      initialMap[lang.code] = {
        productName: '',
        metaDescription: '',
        shortDesc: '',
        desc: '',
        specifications: '',
      }
    })

    if (isEdit && data) {
      // 1. Xử lý bản dịch từ data có sẵn
      // Sửa đoạn xử lý bản dịch trong useEffect:
      languagesData.forEach((lang: any) => {
        const t = data.translations?.find((trans: any) => {
          // So sánh ID ngôn ngữ thay vì .code nếu API trả về ID
          const langId = trans.language?._id || trans.language
          return langId === lang._id || langId === lang.code
        })

        initialMap[lang.code] = {
          productName: t?.productName || '',
          metaDescription: t?.metaDescription || '',
          shortDesc: t?.shortDesc || '',
          desc: t?.desc || '',
          specifications: t?.specifications || '',
        }
      })

      // 2. Load thông tin chung
      // Tìm đoạn này trong useEffect của anh và sửa lại:
      setCommonData({
        code: data.code || '',
        importPrice: data.cost || 0, // JSON là 'cost', không phải 'importPrice'
        salePrice: data.price || 0, // JSON là 'price', không phải 'salePrice'
        discountPrice: data.discount || 0, // JSON là 'discount', không phải 'discountPrice'
        quantity: data.quantity || 0,
        unit: data.unit || 'ks',
        tax: data.tax || 0,
        isVisible: data.isVisible ?? true,
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? false,
        isBestSeller: data.isBestSeller ?? false,
        // Hiển thị ảnh cũ từ API
        relatedProducts: data.relatedProducts || [],

        images:
          data.imageUrls?.map((url: string) => ({
            url,
            isThumbnail: data.thumbnailUrls?.includes(url),
            file: null,
          })) || [],
        removedImages: [],
      })

      const rawCats = data?.categoryIds || data?.categories || []
      const linkedCats = ensureArray(rawCats).map((c: any) =>
        typeof c === 'object' ? c._id : c,
      )

      // 4. Sub-Categories
      const rawSubCats = data?.subCategoryIds || data?.subCategories || []
      const linkedSubCats = ensureArray(rawSubCats).map((s: any) =>
        typeof s === 'object' ? s._id : s,
      )

      // 5. Gộp lại và set vào state
      const allSelectedIds = Array.from(
        new Set([...linkedCats, ...linkedSubCats]),
      )
      setParentIds(allSelectedIds)
      setSelectedBrandId(data.brandIds || '')
      setSelectedSeriesId(data.seriesIds || '')
    }
    setTranslationsMap(initialMap)
  }, [data, isEdit])

  console.log(data)

  // --- HANDLERS ---
  const handleTranslationChange = (field: string, value: string) => {
    setTranslationsMap(prev => ({
      ...prev,
      [modalLang]: { ...prev[modalLang], [field]: value },
    }))
  }

  const onCommonDataChange = (field: string, value: any) => {
    setCommonData(prev => ({ ...prev, [field]: value }))
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

  const createdObjectUrlsRef = useRef<Set<string>>(new Set())

  const createImageId = (file?: File, url?: string) => {
    if (url) return url
    if (!file) return crypto.randomUUID()
    return `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`
  }

  // Ví dụ logic thêm vào component cha
  const [relatedProductIds, setRelatedProductIds] = useState([])

  // Hàm toggle chọn sản phẩm
  const addRelatedProduct = (product: any) => {
    const translation = getTranslation(product?.translations, modalLang)
    const productName = translation?.productName || 'Sản phẩm'

    setCommonData((prev: any) => {
      const currentRelated = prev.relatedProducts || []

      // Kiểm tra trùng dựa trên _id của object
      const isExisting = currentRelated.some(
        (item: any) => item._id === product._id,
      )

      if (isExisting) {
        toast.warning(`Sản phẩm đã tồn tại`, {
          description: `${productName} đã có trong danh sách liên kết.`,
        })
        return prev
      }

      toast.success(`Đã thêm: ${productName}`)

      return {
        ...prev,
        relatedProducts: [...currentRelated, product], // LƯU NGUYÊN OBJECT
      }
    })
  }

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return
      const newImages = files.map((file, index) => {
        const url = URL.createObjectURL(file)
        createdObjectUrlsRef.current.add(url)
        return {
          id: createImageId(file),
          url,
          file,
          isThumbnail: commonData.images.length === 0 && index === 0,
        }
      })
      setCommonData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
      e.target.value = ''
    },
    [commonData.images.length],
  )

  const onRemoveImage = useCallback((idx: number) => {
    setCommonData(prev => {
      const targetImage = prev.images[idx]
      const newImages = prev.images.filter((_, i) => i !== idx)
      const newRemoved = [...prev.removedImages]
      if (!targetImage.file && targetImage.url) newRemoved.push(targetImage.url)
      if (targetImage.file && targetImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(targetImage.url)
        createdObjectUrlsRef.current.delete(targetImage.url)
      }
      if (targetImage.isThumbnail && newImages.length > 0) {
        newImages[0] = { ...newImages[0], isThumbnail: true }
      }
      return { ...prev, images: newImages, removedImages: newRemoved }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentName = translationsMap[modalLang]?.productName // Đổi từ .name sang .productName cho khớp API

    if (!commonData.code || !commonData.code.trim()) {
      return toast.error('Vui lòng nhập MÃ sản phẩm')
    }
    if (!currentName || !currentName.trim()) {
      return toast.error(
        `Vui lòng nhập TÊN sản phẩm (${modalLang.toUpperCase()})`,
      )
    }
    setIsSubmitting(true)
    nProgress.start()

    const toastId = toast.loading(
      isEdit ? 'Đang cập nhật sản phẩm...' : 'Đang tạo sản phẩm...',
    )

    try {
      const formData = new FormData()

      // ===== 1. COMMON DATA (Đổi tên key cho khớp Schema Product) =====
      formData.append('code', commonData.code)
      formData.append('price', String(commonData.salePrice)) // API dùng 'price'
      formData.append('cost', String(commonData.importPrice)) // API dùng 'cost'
      formData.append('discount', String(commonData.discountPrice)) // API dùng 'discount'
      formData.append('quantity', String(commonData.quantity))
      formData.append('unit', commonData.unit)
      formData.append('tax', String(commonData.tax))

      // Các trường Boolean
      formData.append('isFeatured', String(commonData.isFeatured))
      formData.append('isNewArrival', String(commonData.isNewArrival)) // Khớp với Schema isNewArrival
      formData.append('isBestSeller', String(commonData.isBestSeller))

      console.log(commonData)

      // IDs quan hệ
      formData.append('brandIds', selectedBrandId) // API dùng brandIds (số nhiều)
      formData.append('seriesIds', selectedSeriesId)

      const relatedProductIds =
        commonData.relatedProducts?.map((p: any) =>
          typeof p === 'string' ? p : p._id,
        ) || []

      formData.append('relatedProducts', JSON.stringify(relatedProductIds))

      // ===== 2. CATEGORIES (Xử lý mảng ID) =====
      const subCatIds = parentIds.filter(id =>
        filteredSubCats.some((s: any) => s._id === id),
      )
      const mainCatIds = parentIds.filter(id =>
        categories.some((c: any) => c._id === id),
      )

      // API nhận categoryIds là ID đơn hoặc mảng, ở đây gửi JSON string để backend parse
      formData.append('categoryIds', JSON.stringify(mainCatIds))
      formData.append('subCategoryIds', JSON.stringify(subCatIds))

      // ===== 3. TRANSLATIONS (Đồng bộ cấu trúc Schema) =====
      const validTranslations = Object.keys(translationsMap)
        .map(langCode => ({
          language: languagesData.find((l: any) => l.code === langCode)?._id, // API dùng field 'language'
          productName: translationsMap[langCode].productName?.trim(),
          shortDesc: translationsMap[langCode].shortDesc?.trim(),
          desc: translationsMap[langCode].desc?.trim(),
          specifications: translationsMap[langCode].specifications?.trim(),
          metaDescription: translationsMap[langCode].metaDescription?.trim(),
        }))
        .filter(t => t.productName)

      formData.append('translations', JSON.stringify(validTranslations))

      // ===== 4. IMAGES & THUMBNAILS (Logic B2) =====
      const existingImages: string[] = []
      let existingThumbnail: string = ''
      let newFileCounter = 0
      const thumbnailIndexes: number[] = []

      commonData.images.forEach(img => {
        if (img.file) {
          // Gửi file mới vào field 'images' để Backend map index
          formData.append('images', img.file)

          if (img.isThumbnail) {
            thumbnailIndexes.push(newFileCounter)
          }
          newFileCounter++
        } else {
          // Ảnh cũ đã có trên B2
          existingImages.push(img.url)
          if (img.isThumbnail) {
            existingThumbnail = img.url
          }
        }
      })

      formData.append('existingImages', JSON.stringify(existingImages))

      if (existingThumbnail) {
        formData.append('existingThumbnail', existingThumbnail)
      }

      if (thumbnailIndexes.length > 0) {
        formData.append('thumbnailIndexes', JSON.stringify(thumbnailIndexes))
      }

      // ===== 5. REMOVED IMAGES (Dành cho update) =====
      if (
        isEdit &&
        commonData.removedImages &&
        commonData.removedImages.length > 0
      ) {
        formData.append(
          'removedImageUrls',
          JSON.stringify(commonData.removedImages),
        )
      }

      // ===== 6. API CALL =====
      if (isEdit) {
        await productService.updateProduct(data._id, formData)
      } else {
        await productService.createProduct(formData)
      }

      toast.success(
        isEdit ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm thành công!',
        { id: toastId },
      )

      refreshProducts?.()
      onClose()
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra'
      toast.error(msg, { id: toastId })
    } finally {
      setIsSubmitting(false)
      nProgress.done()
    }
  }

  const currentTranslation = translationsMap[modalLang] || {}
  const seoLength = currentTranslation.metaDescription?.length || 0

  return {
    modalLang,
    setModalLang,
    commonData,
    onCommonDataChange,
    translationsMap,
    handleTranslationChange,
    parentIds,
    toggleParentSelection,
    selectedBrandId,
    setSelectedBrandId,
    isSubmitting,
    handleSubmit,
    onFileChange,
    onRemoveImage,
    seoLength,
    isEdit,
    getTranslation,
    selectedSeriesId,
    setSelectedSeriesId,
    fileInputRef,
    setCommonData,
    currentTranslation,
    addRelatedProduct,
    relatedProductIds,
    setRelatedProductIds,
  }
}
