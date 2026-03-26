'use client'

import { motion } from 'framer-motion'
import { FolderPlus, Plus } from 'lucide-react'

import { AdminHeader } from '@/components/layouts'
import {
  ConfirmDeleteModal,
  FloatingActionButton,
  GenericActionBar,
  LanguageSwitcher,
  TabSwitcher,
} from '@/components/shared'

import {
  CategoryFormModal,
  ProjectDetailModal,
  ProjectFilters,
  ProjectFormModal,
  ProjectList,
} from '@/components/features/project/components'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import {
  MaterialManagementProvider,
  useMaterialContext,
} from '@/components/features/materials/hooks'
import DateFilter from '@/components/shared/DateFilter'
import {
  AddInvoiceModal,
  MaterialList,
} from '@/components/features/materials/components'
import MaterialFilters from '@/components/features/materials/components/MaterialFilters'
import { useState } from 'react'
import { Button } from '@/components/ui'

const MaterialManagementContent = () => {
  const { user, handleLogout, projects } = useMaterialContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <AdminHeader user={user} onLogout={handleLogout}>
        <h1 className='text-lg font-bold tracking-tight text-slate-900 mb-2'>
          {'QUẢN LÝ HÓA ĐƠN'}
        </h1>
      </AdminHeader>
      <div
        className='flex flex-col w-full p-6 font-sans text-slate-900 no-scrollbar overflow-y-auto'
        data-lenis-prevent
      >
        <div className='mx-auto w-full mb-8'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <MaterialFilters />
          </div>
        </div>

        <div className='w-full flex-1'>
          <MaterialList />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>thêm hóa đơn</Button>
      </div>
      <AddInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={projects} // Truyền list projects từ context
      />

      {/* 2. Nút FAB để mở Modal */}
      <FloatingActionButton
        onClick={() => setIsModalOpen(true)}
        icon={Plus}
        className='bg-blue-600 active:bg-blue-700' // Đổi màu cho nổi bật
      />
    </>
  )
}

export default function MaterialManagementPage() {
  return (
    <MaterialManagementProvider itemsPerPage={10}>
      <MaterialManagementContent />
    </MaterialManagementProvider>
  )
}
