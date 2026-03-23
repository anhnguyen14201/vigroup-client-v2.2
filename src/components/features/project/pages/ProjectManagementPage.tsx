'use client'

import { useState } from 'react'
import { AdminHeader } from '@/components/layouts'
import {
  ConfirmDeleteModal,
  GenericActionBar,
  LanguageSwitcher,
  TabSwitcher,
} from '@/components/shared'
import DateFilter from '@/components/shared/DateFilter'
import { useAuth, usePaginatedCollection } from '@/hooks'
import { useAuthStore } from '@/stores'
import { HardHat, LayoutGrid, Plus, FolderPlus } from 'lucide-react'
import { languageService, projectTypeService } from '@/services'

import { toast } from 'sonner'
import {
  CategoryFormModal,
  ProjectFormModal,
} from '@/components/features/project/components'
import { ProjectTypeTable } from '@/components/features/project/components/ProjectTypeTable'
import { Pagination } from '@/components/shared'
import {
  ProjectManagementProvider,
  useProjectContext,
} from '@/components/features/project/hooks/ProjectManagementContext'

const ProjectManagementContent = () => {
  const {
    user,
    handleLogout,

    // Filter & Search
    subTab,
    setSubTab,
    searchQuery,
    setSearchQuery,
    activeLangCode,
    setActiveLangCode,
    dateFilter,
    setDateFilter,
    tabs,
    isAllProjects,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Data
    languagesData,
    projectTypeData,
    isProjectTypesLoading,
    refreshProjectTypes,

    // Modal States & Handlers
    isProjectModalOpen,
    setIsProjectModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    selectedCategory,
    handleCreateNew,
    handleEditCategory,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    typeToDelete,
    setTypeToDelete,
    setSelectedCategory,

    // Delete Logic
    deleteId,
    setDeleteId,
    isDeleting,
    handleConfirmDelete,
    openDeleteConfirm, // alias cho đồng bộ naming
  } = useProjectContext()

  return (
    <div className='flex flex-col gap-6 p-6 no-scrollbar overflow-y-auto min-h-screen'>
      <AdminHeader user={user} onLogout={handleLogout}>
        <div className='flex flex-col gap-1'>
          <h1 className='text-lg font-bold tracking-tight text-slate-900 uppercase'>
            {isAllProjects
              ? 'QUẢN LÝ TẤT CẢ DỰ ÁN'
              : 'DANH MỤC LOẠI HÌNH CÔNG TRÌNH'}
          </h1>
          <p className='text-xs text-slate-500 font-medium'>
            {isAllProjects
              ? 'Theo dõi tiến độ và nhân sự công trình'
              : 'Quản lý các nhóm dự án'}
          </p>
        </div>
      </AdminHeader>

      <div className='flex flex-col gap-6 bg-white/50 p-1 rounded-3xl border border-slate-100 backdrop-blur-sm'>
        <div className='flex flex-wrap items-center justify-between p-3 gap-4'>
          <div className='flex w-full justify-between items-center gap-4'>
            <div>
              {isAllProjects && (
                <DateFilter
                  day={dateFilter.day}
                  month={dateFilter.month}
                  year={dateFilter.year}
                  onFilterChange={setDateFilter}
                />
              )}
            </div>

            <div className='flex gap-5'>
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
            </div>
          </div>
        </div>

        <GenericActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={
            isAllProjects ? 'Tìm tên công trình...' : 'Tìm kiểu dự án...'
          }
          buttonLabel={isAllProjects ? 'Tạo dự án mới' : 'Thêm kiểu dự án'}
          buttonIcon={isAllProjects ? FolderPlus : Plus}
          onButtonClick={handleCreateNew}
        />
      </div>

      {/* --- RENDER CONTENT --- */}
      <div className='flex-1'>
        {isAllProjects ? (
          <div className='animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className='h-40 rounded-3xl bg-white border border-slate-100 p-6 shadow-sm'
              >
                <div className='h-4 w-20 bg-primary/10 rounded-full mb-4' />
                <div className='h-5 w-full bg-slate-100 rounded-lg mb-2' />
                <div className='h-5 w-2/3 bg-slate-50 rounded-lg' />
              </div>
            ))}
          </div>
        ) : (
          <>
            <ProjectTypeTable
              data={projectTypeData}
              languages={languagesData}
              onEdit={handleEditCategory} // Truyền hàm xử lý sửa
              onDelete={openDeleteConfirm}
              activeLangCode={activeLangCode}
            />

            {projectTypeData.length > 0 && (
              <div className='mt-4 mb-10'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages || 1}
                  onPageChange={page => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title='Xóa loại hình công trình?'
        description='Bạn có chắc chắn muốn xóa loại dự án này? Các dự án thuộc loại này có thể bị ảnh hưởng.'
      />
      {/* 1. Modal Thêm Dự Án */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        languagesData={languagesData}
        onSuccess={refreshProjectTypes}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false)
          setSelectedCategory(null)
        }}
        languagesData={languagesData}
        initialData={selectedCategory} // Truyền dữ liệu cần sửa vào đây
        onSuccess={async () => {
          await refreshProjectTypes()
          // Có thể gọi fetch data lại ở đây nếu usePaginatedCollection không tự update
        }}
      />
    </div>
  )
}

export default function ProjectManagementPage() {
  return (
    <ProjectManagementProvider itemsPerPage={10}>
      <ProjectManagementContent />
    </ProjectManagementProvider>
  )
}
