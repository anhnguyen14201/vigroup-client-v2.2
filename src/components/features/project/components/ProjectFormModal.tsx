'use client'

import { type FC, useCallback, useState } from 'react'
import { HardHat, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageSwitcher } from '@/components/shared'
import {
  ProjectImageSection,
  ProjectLocationSection,
} from '@/components/features/project/forms'
import ProjectTechnicalSection from '@/components/features/project/forms/ProjectTechnicalSection'
import ProjectContentSection from '@/components/features/project/forms/ProjectContentSection'
import { useProjectForm } from '@/components/features/project/hooks/useProjectForm'
import { usePaginatedCollection } from '@/hooks'
import { userService } from '@/services'
import ProjectCustomerSection from '@/components/features/project/forms/ProjectCustomerSection'

const ProjectFormModal: FC = () => {
  const {
    isEdit,
    loading,
    globalLang,
    setGlobalLang,
    commonData,
    setCommonData,
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
    selectedProjectType,
    currentTranslation,
  } = useProjectForm()

  const [searchQuery, setSearchQuery] = useState('')

  const {
    items: customerData,
    totalPages: apiTotalCustomerPages,
    isLoading: isLoadingCustomer,
    mutate: refreshCustomer,
  } = usePaginatedCollection(
    '/customer',
    { tab: 'customer', search: searchQuery }, // Khách hàng luôn là tab customer
    userService.getUsers,
    1,
    'all',
  )

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) handleClose()
    },
    [handleClose],
  )

  if (!isProjectModalOpen) return null

  return (
    <AnimatePresence>
      <div
        className='fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden'
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
          onClick={handleBackdropClick}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={e => e.stopPropagation()}
          className='relative bg-white w-full max-w-6xl h-[92vh] rounded-[40px] flex flex-col border border-slate-100 overflow-hidden'
        >
          {/* HEADER */}
          <div className='p-8 pb-4 flex items-center justify-between border-b border-slate-50'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg'>
                <HardHat size={22} />
              </div>
              <div>
                <h2 className='text-xl font-black text-slate-900 uppercase tracking-tight'>
                  {isEdit ? 'Cập nhật dự án' : 'Khởi tạo dự án'}
                </h2>
                <p className='text-[10px] font-bold text-indigo-500 uppercase tracking-widest'>
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
                onClick={handleClose}
                className='p-2 hover:bg-slate-100 rounded-full'
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className='flex-1 overflow-y-auto p-10 no-scrollbar'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
              <div className='space-y-4'>
                <ProjectTechnicalSection
                  commonData={commonData}
                  errors={errors}
                  allProjectTypes={allProjectTypes}
                  selectedProjectType={selectedProjectType}
                  onProjectCodeChange={val =>
                    setCommonData(p => ({ ...p, projectCode: val }))
                  }
                  onCategoryChange={val =>
                    setCommonData(p => ({ ...p, category: val }))
                  }
                  onCommonDataChange={(field, value) =>
                    setCommonData(prev => ({ ...prev, [field]: value }))
                  }
                />

                <ProjectCustomerSection
                  customerData={customerData || []}
                  isLoading={isLoadingCustomer}
                  onSearch={setSearchQuery}
                  customerInfo={{
                    // Sửa ở đây: Truy cập vào commonData.customer trước
                    customerId: commonData.customer.customerId,
                    name: commonData.customer.name,
                    phone: commonData.customer.phone,
                    email: commonData.customer.email,
                  }}
                  onChange={info =>
                    setCommonData(prev => ({
                      ...prev,
                      customer: {
                        ...prev.customer,
                        customerId: info.customerId,
                        name: info.name,
                        phone: info.phone,
                        email: info.email,
                      },
                    }))
                  }
                />

                <ProjectLocationSection
                  location={commonData.location}
                  longitude={commonData.longitude}
                  latitude={commonData.latitude}
                  onChange={(field, val) =>
                    setCommonData(p => ({ ...p, [field]: val }))
                  }
                />

                <ProjectImageSection
                  images={commonData.images}
                  fileInputRef={fileInputRef}
                  onFileChange={handleFileChange}
                  onSelectThumbnail={idx =>
                    setCommonData(p => ({
                      ...p,
                      images: p.images.map((img, i) => ({
                        ...img,
                        isThumbnail: i === idx,
                      })),
                    }))
                  }
                  onRemoveImage={handleRemoveImage}
                />
              </div>

              <ProjectContentSection
                globalLang={globalLang}
                currentTranslation={currentTranslation}
                isVisible={commonData.isVisible}
                errors={errors}
                onTranslationChange={handleTranslationChange as any}
                onVisibilityChange={v =>
                  setCommonData(prev => ({ ...prev, isVisible: v }))
                }
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className='p-8 border-t border-slate-50 flex gap-4 bg-white/80 backdrop-blur-md'>
            <Button
              variant='outline'
              onClick={handleClose}
              className='flex-1 h-14 rounded-full font-bold'
            >
              Hủy bỏ
            </Button>
            <Button
              disabled={loading}
              onClick={handleSubmit}
              className='flex-1 h-14 rounded-full font-black text-white'
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

export default ProjectFormModal
