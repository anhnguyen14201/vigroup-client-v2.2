'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { projectService } from '@/services'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'

interface ProjectTranslation {
  language: string
  name: string
  description: string
  metaDescription: string
  buildingType: string
}

interface ProjectImage {
  id: string
  url: string
  file?: File
  isThumbnail: boolean
}

// Interface cho Customer để quản lý chặt chẽ hơn
interface CustomerInfo {
  customerId?: string
  name: string
  phone: string
  email: string
}

const createImageId = (file?: File, url?: string) => {
  if (url) return url
  if (!file) return crypto.randomUUID()
  return `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`
}

export const useProjectForm = () => {
  const {
    languagesData,
    refreshProjectTypes,
    allProjectTypes,
    isProjectModalOpen,
    setIsProjectModalOpen,
    selectedProject,
    refreshProjects,
  } = useProjectContext()

  const isEdit = !!selectedProject
  const [globalLang, setGlobalLang] = useState<string>('vi')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createdObjectUrlsRef = useRef<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [commonData, setCommonData] = useState({
    projectCode: '',
    category: '',
    longitude: '',
    latitude: '',
    isVisible: true,
    nightShiftCoeff: '2.0',
    contractAmount: '',
    location: '',
    images: [] as ProjectImage[],
    removedImages: [] as string[],
    // Cập nhật cấu trúc customer
    customer: {
      customerId: undefined,
      name: '',
      phone: '',
      email: '',
    } as CustomerInfo,
  })

  const [translations, setTranslations] = useState<
    Record<string, ProjectTranslation>
  >({})

  const cleanupObjectUrls = useCallback(() => {
    createdObjectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    createdObjectUrlsRef.current.clear()
  }, [])

  const buildBlankTranslations = useCallback(() => {
    const initialTrans: Record<string, ProjectTranslation> = {}
    languagesData.forEach((l: any) => {
      initialTrans[l.code] = {
        language: l._id,
        name: '',
        description: '',
        metaDescription: '',
        buildingType: '',
      }
    })
    return initialTrans
  }, [languagesData])

  const resetForm = useCallback(() => {
    cleanupObjectUrls()
    setCommonData({
      projectCode: '',
      category: '',
      longitude: '',
      latitude: '',
      isVisible: false,
      nightShiftCoeff: '2',
      contractAmount: '',
      location: '',
      images: [],
      removedImages: [],
      customer: { customerId: undefined, name: '', phone: '', email: '' },
    })
    setTranslations(buildBlankTranslations())
    setErrors({})
  }, [buildBlankTranslations, cleanupObjectUrls])

  useEffect(() => {
    if (!isProjectModalOpen) {
      cleanupObjectUrls()
      return
    }
    if (languagesData.length === 0) return

    if (isEdit && selectedProject) {
      const initialTrans: Record<string, ProjectTranslation> = {}
      languagesData.forEach((l: any) => {
        const existing = selectedProject?.translations?.find(
          (t: any) => t.language._id === l._id || t.language === l._id,
        )
        initialTrans[l.code] = {
          language: l._id,
          name: existing?.name || existing?.projectName || '',
          description: existing?.description || '',
          metaDescription: existing?.metaDescription || '',
          buildingType: existing?.buildingType || '',
        }
      })

      const thumbnailUrl = selectedProject.thumbnailUrls?.[0] || ''
      const allUrls = [
        ...(thumbnailUrl ? [thumbnailUrl] : []),
        ...(selectedProject.imageUrls || []).filter(
          (url: string) => url !== thumbnailUrl,
        ),
      ]

      setTranslations(initialTrans)
      setCommonData({
        projectCode: selectedProject.code || selectedProject.projectCode || '',
        category:
          typeof selectedProject.projectType === 'object'
            ? selectedProject.projectType?._id
            : selectedProject.projectType || '',
        longitude: selectedProject.longitude || '',
        latitude: selectedProject.latitude || '',
        location: selectedProject.location || '',
        isVisible: selectedProject.showProject ?? false,
        nightShiftCoeff: selectedProject.nightShiftPay || '',
        contractAmount: selectedProject.totalAmount?.toString() || '',
        images: allUrls.map((url: string, index: number) => ({
          id: createImageId(undefined, url),
          url,
          isThumbnail: index === 0,
        })),
        removedImages: [],
        // Mapping dữ liệu khách hàng từ API cũ nếu có
        customer: {
          customerId:
            selectedProject.customer?._id || selectedProject.customerId,
          name:
            selectedProject.customerName ||
            selectedProject.customer?.fullName ||
            '',
          phone:
            selectedProject.customerPhone ||
            selectedProject.customer?.phone ||
            '',
          email:
            selectedProject.customerEmail ||
            selectedProject.customer?.email ||
            '',
        },
      })
    } else {
      resetForm()
    }
  }, [
    isProjectModalOpen,
    languagesData,
    isEdit,
    selectedProject,
    resetForm,
    cleanupObjectUrls,
  ])

  const validateField = useCallback((name: string, value: any) => {
    let error = ''
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'Trường này không được để trống'
    }
    setErrors(prev =>
      prev[name] === error ? prev : { ...prev, [name]: error },
    )
    return error
  }, [])

  const handleClose = useCallback(() => {
    cleanupObjectUrls()
    setIsProjectModalOpen(false)
  }, [cleanupObjectUrls, setIsProjectModalOpen])

  const handleTranslationChange = useCallback(
    (field: keyof ProjectTranslation, value: string) => {
      setTranslations(prev => ({
        ...prev,
        [globalLang]: { ...prev[globalLang], [field]: value },
      }))
      if (field === 'name' && errors[`name_${globalLang}`])
        validateField(`name_${globalLang}`, value)
    },
    [globalLang, errors, validateField],
  )

  const handleFileChange = useCallback(
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

  const handleRemoveImage = useCallback((idx: number) => {
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

  const handleSubmit = async () => {
    const currentTrans = translations[globalLang]
    const codeErr = validateField('projectCode', commonData.projectCode)
    const categoryErr = validateField('category', commonData.category)
    const nameErr = validateField(`name_${globalLang}`, currentTrans?.name)

    if (codeErr || categoryErr || nameErr) {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc!')
      return
    }

    setLoading(true)
    nProgress.start()
    try {
      const formData = new FormData()
      formData.append('kind', 'project')
      formData.append('code', commonData.projectCode)
      formData.append('projectType', commonData.category)
      formData.append('longitude', commonData.longitude)
      formData.append('latitude', commonData.latitude)
      formData.append('showProject', String(commonData.isVisible))
      formData.append('nightShiftPay', commonData.nightShiftCoeff)
      formData.append('totalAmount', commonData.contractAmount)
      formData.append('location', commonData.location)

      // --- PHẦN CUSTOMER DATA ---
      if (commonData.customer.customerId) {
        formData.append('customer', commonData.customer.customerId)
      }
      formData.append('customerName', commonData.customer.name)
      formData.append('customerPhone', commonData.customer.phone)
      formData.append('customerEmail', commonData.customer.email)
      // --------------------------

      const validTrans = Object.values(translations).filter(
        t => t.name.trim() !== '',
      )
      formData.append(
        'translations',
        JSON.stringify(
          validTrans.map(t => ({
            language: t.language,
            projectName: t.name,
            description: t.description,
            buildingType: t.buildingType,
            metaDescription: t.metaDescription,
          })),
        ),
      )

      const existingImages: string[] = []
      let existingThumbnail: string = ''
      let newFileCounter = 0
      const thumbnailIndexes: number[] = []

      commonData.images.forEach(img => {
        if (img.file) {
          formData.append('images', img.file)
          if (img.isThumbnail) thumbnailIndexes.push(newFileCounter)
          newFileCounter++
        } else {
          existingImages.push(img.url)
          if (img.isThumbnail) existingThumbnail = img.url
        }
      })

      formData.append('existingImages', JSON.stringify(existingImages))
      if (existingThumbnail)
        formData.append('existingThumbnail', existingThumbnail)
      if (thumbnailIndexes.length > 0)
        formData.append('thumbnailIndexes', JSON.stringify(thumbnailIndexes))

      if (isEdit && commonData.removedImages.length > 0) {
        formData.append(
          'removedImageUrls',
          JSON.stringify(commonData.removedImages),
        )
      }

      if (isEdit) {
        await projectService.updateProject(selectedProject._id, formData)
      } else {
        await projectService.createProject(formData)
      }

      handleClose()
      toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo dự án thành công!')
      refreshProjects?.()
      refreshProjectTypes?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi hệ thống!')
    } finally {
      setLoading(false)
      nProgress.done()
    }
  }

  return {
    isEdit,
    loading,
    globalLang,
    setGlobalLang,
    commonData,
    setCommonData,
    translations,
    errors,
    languagesData,
    allProjectTypes,
    isProjectModalOpen,
    fileInputRef,
    handleClose,
    handleTranslationChange,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
    selectedProjectType: allProjectTypes?.find(
      (type: any) => type._id === commonData.category,
    ),
    currentTranslation: translations[globalLang],
  }
}
