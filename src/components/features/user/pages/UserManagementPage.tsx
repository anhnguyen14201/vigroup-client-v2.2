'use client'

import { createPortal } from 'react-dom'
import {
  ConfirmDeleteModal,
  FloatingActionButton,
  ItemCounter,
} from '@/components/shared'
import UserFormDrawer from '@/components/features/user/components/UserFormDrawer'
import UserDetailModal from '@/components/features/user/components/UserDetailModal'
import {
  AdminHeaderSection,
  PaginationWrapper,
  UserActionBar,
  UserFilterSection,
  UserGridList,
  UserHeaderSection,
} from '@/components/features/user/components'
import {
  UserManagementProvider,
  useUserContext,
} from '@/components/features/user/hooks/UserManagementContext'

const ITEMS_PER_PAGE = 8

const UserManagementPageContent = () => {
  const {
    subTab,
    deleteId,
    setDeleteId,
    userToDelete,
    confirmDelete,
    selectedDetail,
    handleOpenForm,
    displayUsers,
    totalItems,
  } = useUserContext()

  return (
    <>
      <AdminHeaderSection />

      <div
        className='flex flex-col p-6 font-sans text-slate-900 no-scrollbar overflow-y-auto'
        data-lenis-prevent
      >
        <div className='mx-auto w-full mb-8'>
          <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-6'>
            <div className='flex gap-3 flex-col xl:flex-row xl:items-center justify-center items-start'>
              <UserFilterSection />

              <div className=''>
                <ItemCounter
                  currentCount={displayUsers.length}
                  totalCount={totalItems}
                  label={subTab === 'staff' ? 'nhân viên' : 'khách hàng'}
                  className='ml-auto' // Đẩy sang bên phải nếu nằm trong flex container
                />
              </div>
            </div>

            {/* Tab Switcher */}
            <UserHeaderSection />
          </div>
        </div>

        {/* Action Bar */}
        <UserActionBar />

        {/* Grid Content */}
        <div className='mx-auto w-full flex-1 no-scrollbar'>
          <UserGridList />
        </div>

        <FloatingActionButton
          onClick={() => handleOpenForm(null)}
          // icon={Wallet} // Nếu không truyền sẽ mặc định là dấu Plus
        />

        <PaginationWrapper />

        <ConfirmDeleteModal
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title={subTab === 'staff' ? 'Xóa nhân viên?' : 'Xóa khách hàng?'}
          description={`Bạn có chắc muốn xóa "${userToDelete?.fullName || 'thành viên'}"? Hành động này không thể hoàn tác.`}
        />

        <UserFormDrawer />

        {selectedDetail && createPortal(<UserDetailModal />, document.body)}
      </div>
    </>
  )
}

export default function UserManagementPage() {
  return (
    <UserManagementProvider itemsPerPage={ITEMS_PER_PAGE}>
      <UserManagementPageContent />
    </UserManagementProvider>
  )
}
