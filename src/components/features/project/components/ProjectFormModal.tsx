'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import {
  HardHat,
  X,
  Camera,
  MapPin,
  Layers,
  Settings2,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui'
import { toast } from 'sonner'
import { projectService } from '@/services'
import { LanguageSwitcher, RichTextEditor } from '@/components/shared'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import Image from 'next/image'

// --- ErrorMessage Component (Đặt ở trên hoặc import) ---
const ErrorMessage = ({ message }: { message?: string }) => (
  <AnimatePresence mode='wait'>
    {message && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className='text-[10px] font-bold text-red-500 mt-1 ml-2 uppercase tracking-tight'
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
)

interface ProjectTranslation {
  language: string
  name: string
  description: string
  metaDescription: string
  address: string
}

interface ProjectImage {
  url: string
  file?: File
  isThumbnail: boolean
}

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
  onSuccess?: () => void
}

const ProjectFormModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: ProjectFormModalProps) => {
  const [globalLang, setGlobalLang] = useState<string>('vi')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { languagesData, projectTypeData } = useProjectContext()

  // State quản lý lỗi
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [commonData, setCommonData] = useState({
    projectCode: '',
    category: '',
    longitude: '',
    latitude: '',
    isVisible: true,
    nightShiftCoeff: '2.0',
    contractAmount: '',
    images: [] as ProjectImage[],
  })

  const [translations, setTranslations] = useState<
    Record<string, ProjectTranslation>
  >({})

  const isEdit = !!initialData

  // Khởi tạo/Reset form data
  const resetForm = () => {
    setCommonData({
      projectCode: '',
      category: '',
      longitude: '',
      latitude: '',
      isVisible: false,
      nightShiftCoeff: '2',
      contractAmount: '',
      images: [],
    })
    const initialTrans: Record<string, ProjectTranslation> = {}
    languagesData.forEach((l: any) => {
      initialTrans[l.code] = {
        language: l._id,
        name: '',
        description: '',
        metaDescription: '',
        address: '',
      }
    })
    setTranslations(initialTrans)
    setErrors({})
  }

  useEffect(() => {
    if (isOpen && languagesData.length > 0) {
      if (isEdit) {
        // Load data edit
        const initialTrans: Record<string, ProjectTranslation> = {}
        languagesData.forEach((l: any) => {
          const existing = initialData?.translations?.find(
            (t: any) => t.language._id === l._id || t.language === l._id,
          )
          initialTrans[l.code] = {
            language: l._id,
            name: existing?.name || existing?.projectName || '',
            description: existing?.description || '',
            metaDescription: existing?.metaDescription || '',
            address: existing?.address || existing?.buildingType || '',
          }
        })
        setTranslations(initialTrans)
        setCommonData({
          projectCode: initialData.code || initialData.projectCode || '',
          category:
            initialData.projectType?._id || initialData.projectType || '',
          longitude: initialData.longitude || '',
          latitude: initialData.latitude || '',
          isVisible: initialData.showProject ?? true,
          nightShiftCoeff: initialData.nightShiftPay?.toString() || '1.0',
          contractAmount: initialData.totalAmount?.toString() || '',
          images:
            initialData.images?.map((img: any, index: number) => ({
              url: typeof img === 'string' ? img : img.url,
              isThumbnail: index === 0,
            })) || [],
        })
      } else {
        resetForm()
      }
    }
  }, [isOpen, languagesData, initialData])

  // --- Validation Logic ---
  const validateField = (name: string, value: any) => {
    let error = ''
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'Trường này không được để trống'
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  // --- Logic Submit ---
  const handleSubmit = async () => {
    // Validate tất cả các trường bắt buộc
    const codeErr = validateField('projectCode', commonData.projectCode)
    const categoryErr = validateField('category', commonData.category)
    const nameErr = validateField(
      'name_' + globalLang,
      translations[globalLang]?.name,
    )

    if (codeErr || categoryErr || nameErr) {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc!')
      return
    }

    setLoading(true)
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

      const validTrans = Object.values(translations).filter(
        t => t.name.trim() !== '',
      )
      const processedTrans = validTrans.map(t => ({
        language: t.language,
        projectName: t.name,
        description: t.description,
        metaDescription: t.metaDescription,
        buildingType: t.address,
      }))
      formData.append('translations', JSON.stringify(processedTrans))

      const thumbnailIndexes: number[] = []
      commonData.images.forEach((img, index) => {
        if (img.file) {
          formData.append('images', img.file)
          if (img.isThumbnail) thumbnailIndexes.push(index)
        } else {
          formData.append('existingImages', img.url)
          if (img.isThumbnail) formData.append('existingThumbnail', img.url)
        }
      })
      formData.append('thumbnailIndexes', JSON.stringify(thumbnailIndexes))

      if (isEdit) {
        await projectService.updateProject(initialData._id, formData)
      } else {
        await projectService.createProject(formData)
        resetForm() // Chỉ reset khi thêm mới thành công
      }

      toast.success('Thao tác thành công!')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi hệ thống!')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className='fixed inset-0 z-100 flex items-center justify-center p-4 
                  bg-slate-900/60 backdrop-blur-md overflow-hidden'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className='relative bg-white w-full max-w-6xl h-[92vh] rounded-[40px] 
                    flex flex-col border border-slate-100 overflow-hidden'
        >
          {/* Header */}
          <div
            className='p-8 pb-4 flex items-center justify-between border-b 
                      border-slate-50'
          >
            <div className='flex items-center gap-4'>
              <div
                className='w-12 h-12 rounded-2xl bg-slate-900 flex items-center 
                          justify-center text-white shadow-lg'
              >
                <HardHat size={22} />
              </div>
              <div>
                <h2 className='text-xl font-black text-slate-900 uppercase tracking-tight'>
                  {isEdit ? 'Cập nhật dự án' : 'Khởi tạo dự án'}
                </h2>
                <p
                  className='text-[10px] font-bold text-indigo-500 uppercase 
                            tracking-widest'
                >
                  Dữ liệu hệ thống vigroup
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <LanguageSwitcher
                languagesData={languagesData}
                currentLang={globalLang}
                onLangChange={setGlobalLang}
              />
              <button
                onClick={onClose}
                className='p-2 hover:bg-slate-100 rounded-full transition-colors'
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className='flex-1 overflow-y-auto p-10 no-scrollbar'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
              {/* CỘT 1: KỸ THUẬT */}
              <div className='space-y-4'>
                <section className=''>
                  <SectionTitle icon={Settings2} title='Cấu hình kỹ thuật' />
                  <div className='grid grid-cols-2 gap-4 mt-6'>
                    <Field label='Mã dự án' required>
                      <Input
                        value={commonData.projectCode}
                        onChange={e => {
                          setCommonData({
                            ...commonData,
                            projectCode: e.target.value,
                          })
                          if (errors.projectCode)
                            validateField('projectCode', e.target.value)
                        }}
                        placeholder='ANGEN-2026'
                        className='rounded-full bg-slate-50 border-none h-10 focus:ring-2 
                                  focus:ring-indigo-500/20'
                      />
                      <ErrorMessage message={errors.projectCode} />
                    </Field>

                    <Field label='Kiểu dự án' required>
                      <Select
                        value={commonData.category}
                        onValueChange={value => {
                          setCommonData({
                            ...commonData,
                            category: value,
                          })
                          if (errors.category) {
                            validateField('category', value)
                          }
                        }}
                      >
                        <SelectTrigger
                          className='w-full z-1000 rounded-full bg-slate-50 border-none h-14 
                                    px-5 py-5 font-semibold focus:ring-indigo-500/20 
                                    outline-none shadow-none focus:ring-0 focus:ring-offset-0 
                                    focus:outline-none focus-visible:ring-0 
                                    focus-visible:outline-none cursor-pointer'
                        >
                          <SelectValue placeholder='Chọn loại...' />
                        </SelectTrigger>

                        <SelectContent
                          position='popper'
                          sideOffset={0}
                          className='rounded-xl border-slate-100 z-10000 bg-white shadow-none'
                        >
                          {' '}
                          {projectTypeData?.map((type: any) => {
                            const viName =
                              type.translations?.find(
                                (t: any) => t.language.code === 'vi',
                              )?.name || type.name

                            return (
                              <SelectItem
                                key={type._id}
                                value={type._id}
                                className='text-xs font-medium cursor-pointer'
                              >
                                {viName}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>

                      <ErrorMessage message={errors.category} />
                    </Field>
                  </div>

                  <div className='grid grid-cols-2 gap-4 mt-4'>
                    <Field label='Khoán dự án (VNĐ)'>
                      <div className='relative'>
                        <Input
                          type='number'
                          value={commonData.contractAmount}
                          onChange={e =>
                            setCommonData({
                              ...commonData,
                              contractAmount: e.target.value,
                            })
                          }
                          onWheel={e => (e.target as HTMLInputElement).blur()}
                          className='rounded-full bg-slate-50 border-none h-10 pl-10'
                        />
                        <DollarSign
                          size={14}
                          className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                        />
                      </div>
                    </Field>

                    <Field label='Hệ số ca đêm'>
                      <Input
                        type='number'
                        value={commonData.nightShiftCoeff}
                        onChange={e =>
                          setCommonData({
                            ...commonData,
                            nightShiftCoeff: e.target.value,
                          })
                        }
                        // Chặn thay đổi giá trị khi cuộn chuột
                        onWheel={e => (e.target as HTMLInputElement).blur()}
                        className='rounded-full bg-slate-50 border-none h-10'
                      />
                    </Field>
                  </div>
                </section>

                <section>
                  <SectionTitle icon={MapPin} title='Vị trí địa lý' />
                  <div className='grid grid-cols-2 gap-4 mt-6'>
                    <Input
                      placeholder='Kinh độ (Long)'
                      value={commonData.longitude}
                      onChange={e =>
                        setCommonData({
                          ...commonData,
                          longitude: e.target.value,
                        })
                      }
                      className='rounded-full bg-slate-50 border-none h-10'
                    />
                    <Input
                      placeholder='Vĩ độ (Lat)'
                      value={commonData.latitude}
                      onChange={e =>
                        setCommonData({
                          ...commonData,
                          latitude: e.target.value,
                        })
                      }
                      className='rounded-full bg-slate-50 border-none h-10'
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle icon={ImageIcon} title='Hình ảnh dự án' />
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6'>
                    {' '}
                    {/* Chuyển sang 3 cột, tăng gap để thoáng hơn */}
                    {commonData.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCommonData(p => ({
                            ...p,
                            images: p.images.map((im, i) => ({
                              ...im,
                              isThumbnail: i === idx,
                            })),
                          }))
                        }}
                        className={`relative aspect-square rounded-4xl overflow-hidden 
                                  group border-2 cursor-pointer transition-all duration-300 ${
                                    img.isThumbnail
                                      ? 'border-primary' // Tăng ring cho tương xứng kích thước lớn
                                      : 'border-transparent hover:border-slate-300'
                                  }`}
                      >
                        <Image
                          src={img.url}
                          alt={`Project image ${idx + 1}`}
                          fill
                          className='object-contain transition-transform duration-700 
                                    group-hover:scale-110'
                          sizes='(max-width: 768px) 50vw, 33vw' // Cập nhật sizes vì mỗi ảnh giờ chiếm 1/3 màn hình
                        />

                        {/* Overlay: Nút xóa nhỏ gọn ở giữa */}
                        <div
                          className='absolute inset-0 bg-black/30 opacity-0 
                                    group-hover:opacity-100 transition-all duration-300 
                                    flex items-center justify-center'
                        >
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setCommonData(p => {
                                const newImages = p.images.filter(
                                  (_, i) => i !== idx,
                                )
                                if (img.isThumbnail && newImages.length > 0) {
                                  newImages[0].isThumbnail = true
                                }
                                return { ...p, images: newImages }
                              })
                            }}
                            className='w-10 h-10 bg-white/20 cursor-pointer 
                                      backdrop-blur-md hover:bg-rose-500 rounded-full 
                                      text-white flex items-center justify-center 
                                      transition-all transform hover:scale-110 border 
                                      border-white/30 shadow-2xl'
                          >
                            <X size={18} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Badge Main - Sang trọng hơn */}
                        {img.isThumbnail && (
                          <div
                            className='absolute top-2 left-2 px-3 py-1.5 bg-primary 
                                      rounded-full
                                      flex items-center gap-2'
                          >
                            <p className='text-[8px] font-black text-white uppercase'>
                              Ảnh nền
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Nút Upload cũng được scale theo */}
                    <input
                      type='file'
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={e => {
                        const files = Array.from(e.target.files || [])
                        const newImages = files.map((file, index) => ({
                          url: URL.createObjectURL(file),
                          file,
                          isThumbnail:
                            commonData.images.length === 0 && index === 0,
                        }))
                        setCommonData(prev => ({
                          ...prev,
                          images: [...prev.images, ...newImages],
                        }))
                      }}
                      accept='image/*'
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className='aspect-square rounded-4xl cursor-pointer border-2 
                                border-dashed border-slate-200 flex flex-col items-center 
                                justify-center text-slate-400 hover:bg-slate-50 
                                hover:border-indigo-300 transition-all group'
                    >
                      <div
                        className='w-12 h-12 rounded-2xl bg-slate-50 flex items-center 
                                  justify-center mb-3 group-hover:bg-indigo-50 
                                  group-hover:text-indigo-500 transition-colors'
                      >
                        <Camera size={28} />
                      </div>
                      <span className='text-[10px] font-black uppercase tracking-widest'>
                        Thêm hình ảnh
                      </span>
                    </button>
                  </div>
                </section>
              </div>

              {/* CỘT 2: NỘI DUNG */}
              <div className='space-y-4'>
                <SectionTitle
                  icon={Layers}
                  title={`Nội dung (${globalLang.toUpperCase()})`}
                />

                <Field label='Tên công trình' required>
                  <Input
                    value={translations[globalLang]?.name || ''}
                    onChange={e => {
                      setTranslations(prev => ({
                        ...prev,
                        [globalLang]: {
                          ...prev[globalLang],
                          name: e.target.value,
                        },
                      }))
                      if (errors['name_' + globalLang])
                        validateField('name_' + globalLang, e.target.value)
                    }}
                    placeholder='Tên dự án hiển thị...'
                    className='rounded-full bg-slate-50 border-none h-11 text-base 
                              font-semibold'
                  />
                  <ErrorMessage message={errors['name_' + globalLang]} />
                </Field>

                <Field label='Địa chỉ'>
                  <Input
                    value={translations[globalLang]?.address || ''}
                    onChange={e =>
                      setTranslations(prev => ({
                        ...prev,
                        [globalLang]: {
                          ...prev[globalLang],
                          address: e.target.value,
                        },
                      }))
                    }
                    placeholder='Vị trí dự án...'
                    className='rounded-full bg-slate-50 border-none h-11'
                  />
                </Field>

                <Field label='Mô tả ngắn cho SEO'>
                  <Textarea
                    value={translations[globalLang]?.metaDescription || ''}
                    onChange={e =>
                      setTranslations(prev => ({
                        ...prev,
                        [globalLang]: {
                          ...prev[globalLang],
                          metaDescription: e.target.value,
                        },
                      }))
                    }
                    className='rounded-2xl bg-slate-50 border-none min-h-20
                              resize-none text-sm'
                  />
                </Field>

                <Field label='Mô tả chi tiết'>
                  <div className='rounded-2xl overflow-hidden border border-slate-100'>
                    <RichTextEditor
                      value={translations[globalLang]?.description || ''}
                      onChange={content =>
                        setTranslations(prev => ({
                          ...prev,
                          [globalLang]: {
                            ...prev[globalLang],
                            description: content,
                          },
                        }))
                      }
                    />
                  </div>
                </Field>

                <div
                  className='flex items-center justify-between py-3 px-3 bg-slate-50 
                            rounded-full'
                >
                  <span
                    className='text-[10px] font-bold text-primary uppercase 
                              tracking-widest'
                  >
                    hiển thị dự án
                  </span>
                  <Switch
                    checked={commonData.isVisible}
                    onCheckedChange={v =>
                      setCommonData({ ...commonData, isVisible: v })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className='p-8 border-t border-slate-50 flex gap-4 bg-white/80 
                      backdrop-blur-md'
          >
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1 h-14 rounded-full font-bold text-slate-400'
            >
              Hủy bỏ
            </Button>
            <Button
              disabled={loading}
              onClick={handleSubmit}
              className='flex-1 h-14 rounded-full font-black  text-white  transition-all 
                        active:scale-95'
            >
              {loading
                ? 'Đang xử lý...'
                : isEdit
                  ? 'Cập nhật dự án'
                  : 'Xác nhận khởi tạo'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className='flex items-center gap-2 pb-3 border-b border-slate-100'>
    <Icon size={16} className='text-indigo-600' />
    <span className='text-[11px] font-black text-slate-900 uppercase tracking-widest'>
      {title}
    </span>
  </div>
)

const Field = ({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) => (
  <div className=''>
    <label
      className='text-[10px] font-bold text-slate-400 uppercase ml-2 flex 
                items-center gap-1'
    >
      {label} {required && <span className='text-rose-500'>*</span>}
    </label>
    {children}
  </div>
)

export default ProjectFormModal
