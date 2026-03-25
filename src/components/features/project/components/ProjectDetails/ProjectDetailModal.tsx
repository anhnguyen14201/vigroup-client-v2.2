'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  FileText,
  CreditCard,
  Package,
  Hammer,
  PlusCircle,
  History,
  X,
} from 'lucide-react'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import { usePaginatedCollection } from '@/hooks'
import { projectService } from '@/services'
import { purchaseInvoiceService } from '@/services/purchaseInvoiceService'

import { Tabs, TabsList } from '@/components/ui'
import HeaderSection from './HeaderSection'
import TabTriggerItem from './TabTriggerItem'
import OverviewTab from './OverviewTab'
import LogsTab from './LogsTab'
import GlobalStyles from './GlobalStyles'
import PaymentsTab from './PaymentsTab'
import QuotesTab from './QuotesTab'
import MaterialsTab from './MaterialsTab'
import { useState } from 'react'
import LaborTab from '@/components/features/project/components/ProjectDetails/LaborTab'

// Import sub-components

const ProjectDetailModal = () => {
  const {
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedProject,
    refreshProjects,
  } = useProjectContext()

  const [currentPage, setCurrentPage] = useState(1)

  const {
    items: projectData,
    isLoading,
    mutate: refreshProject,
  } = usePaginatedCollection(
    `project-${selectedProject?._id}`,
    { projectId: selectedProject?._id }, // filters
    async ({ filters }) => {
      // Trích xuất id từ filters để truyền vào hàm API
      return await projectService.getProjectById(filters.projectId)
    },
    1,
    1,
  )

  const {
    items: invoices,
    isLoading: isInvoicesLoading,
    totalInvoiceAmount,
    totalItems,
    totalPages,
  } = usePaginatedCollection(
    selectedProject?._id ? `invoices-${selectedProject._id}` : null,
    { projectId: selectedProject?._id },
    // Chúng ta bọc lại một chút để truyền thêm projectId vào service
    async ({ pageIndex, pageSize, filters }) =>
      await purchaseInvoiceService.getAllPurchaseInvoiceByProjectId({
        ...filters, // Trong filters đã có projectId rồi
        pageIndex,
        pageSize,
      }),
    currentPage, // pageIndex
    10, // pageSize
  )

  if (!selectedProject) return null

  return (
    <AnimatePresence>
      {isDetailModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailModalOpen(false)}
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
          />
          

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className='relative w-full max-w-[1300px] h-[92vh] bg-[#F8FAFC] rounded-[2.5rem] overflow-hidden flex flex-col'
          >
            {/* 1. HEADER */}
            <HeaderSection
              project={projectData}
              mutate={refreshProjects}
              setIsDetailModalOpen={setIsDetailModalOpen}
            />

            <Tabs
              defaultValue='overview'
              className='flex-1 flex flex-col overflow-hidden'
            >
              {/* 2. NAVIGATION */}
              <div className='px-8 bg-white border-b flex justify-between items-center shrink-0 shadow-sm z-10'>
                <TabsList className='bg-transparent h-14 gap-2 md:gap-6 overflow-x-auto no-scrollbar'>
                  <TabTriggerItem
                    value='overview'
                    icon={<Briefcase size={16} />}
                    label='Tổng quan'
                  />
                  <TabTriggerItem
                    value='payments'
                    icon={<CreditCard size={16} />}
                    label='Thanh toán'
                  />
                  <TabTriggerItem
                    value='quotes'
                    icon={<FileText size={16} />}
                    label='Báo giá'
                  />
                  <TabTriggerItem
                    value='additional'
                    icon={<PlusCircle size={16} />}
                    label='Phát sinh'
                  />
                  <TabTriggerItem
                    value='materials'
                    icon={<Package size={16} />}
                    label='Hóa đơn vật tư'
                  />
                  <TabTriggerItem
                    value='labor'
                    icon={<Hammer size={16} />}
                    label='Nhân công'
                  />
                  <TabTriggerItem
                    value='logs'
                    icon={<History size={16} />}
                    label='Nhật ký'
                    isWarning
                  />
                </TabsList>
              </div>

              {/* 3. CONTENT AREA */}
              <div className='flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar'>
                <OverviewTab
                  project={projectData}
                  totalInvoiceAmount={totalInvoiceAmount}
                  totalItems={totalItems}
                />

                <PaymentsTab project={projectData} onRefresh={refreshProject} />
                {/* Empty State Tabs */}
                <QuotesTab
                  project={projectData}
                  type='quotation'
                  onRefresh={refreshProject}
                />

                {/* Tab Phát Sinh */}
                <QuotesTab
                  project={projectData}
                  type='variation'
                  onRefresh={refreshProject}
                />
                <MaterialsTab
                  invoices={invoices}
                  totalItems={totalItems}
                  isLoading={isInvoicesLoading}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  totalInvoiceAmount={totalInvoiceAmount}
                />
                {/* <EmptyContentTab
                  value='additional'
                  icon={<PlusCircle size={40} />}
                  text='Các khoản chi phí phát sinh ngoài báo giá gốc'
                /> */}

                <LaborTab project={projectData} />

                <LogsTab />
              </div>
            </Tabs>

            <GlobalStyles />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProjectDetailModal
