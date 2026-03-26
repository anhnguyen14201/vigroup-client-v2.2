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

const MaterialManagementContent = () => {
  const { user, handleLogout } = useMaterialContext()

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
            {/* <div>{isAllProjects && <ProjectFilters />}</div>

            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
              <LanguageSwitcher
                languagesData={languagesData}
                currentLang={activeLangCode}
                onLangChange={setActiveLangCode}
              />

              <TabSwitcher
                options={tabs}
                activeTab={subTab}
                onChange={id => setSubTab(id)}
              />
            </div> */}
          </div>
        </div>

        {/* <GenericActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={
            isAllProjects
              ? 'Nhâp vào tên dự án hoặc mã dự án...'
              : 'Nhập vào tên kiểu dự án...'
          }
          buttonLabel={isAllProjects ? 'Tạo dự án mới' : 'Thêm kiểu dự án'}
          buttonIcon={isAllProjects ? FolderPlus : Plus}
          onButtonClick={handleCreateNew}
        /> */}
        {/* --- RENDER CONTENT --- */}
        {/*  <div className='mx-auto w-full flex-1 no-scrollbar'>
          <ProjectList />
        </div> */}

        {/* <FloatingActionButton
          onClick={handleCreateNew}
          // icon={Wallet} // Nếu không truyền sẽ mặc định là dấu Plus
        /> */}

        {/* 1. Modal Thêm Dự Án */}
        {/* <ProjectFormModal />

        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDeleteProject}
          loading={false}
          title='Xóa dự án?'
          description={`Bạn có chắc chắn muốn xóa dự án ${
            projectToDelete?.code || projectToDelete?.name || ''
          } không? Hành động này không thể hoàn tác.`}
        />

        <ConfirmDeleteModal
          open={isDeleteModalTypeOpen}
          onOpenChange={setIsDeleteModalTypeOpen}
          onConfirm={handleConfirmDeleteProjectType}
          loading={isDeleting}
          title='Xóa kiểu dự án?'
          description='Bạn có chắc chắn muốn xóa loại dự án này? Các dự án thuộc loại này có thể bị ảnh hưởng.'
        />
        <CategoryFormModal />

        <ProjectDetailModal /> */}
      </div>
    </>
  )
}

export default function MaterialManagementPage() {
  return (
    <MaterialManagementProvider itemsPerPage={8}>
      <MaterialManagementContent />
    </MaterialManagementProvider>
  )
}
