'use client'

import { createPortal } from 'react-dom'
import { ConfirmDeleteModal } from '@/components/shared'
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
  } = useUserContext()

  return (
    <>
      <AdminHeaderSection />

      <div
        className='flex flex-col p-6 font-sans text-slate-900 no-scrollbar overflow-y-auto'
        data-lenis-prevent
      >
        <div className='mx-auto w-full mb-8'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <div>
              {' '}
              <UserFilterSection />
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
