import { useUserContext } from '@/components/features/user/hooks/UserManagementContext'
import { AdminHeader } from '@/components/layouts'
import React from 'react'

const AdminHeaderSection = () => {
  const { subTab, user, handleLogout } = useUserContext()
  return (
    <AdminHeader user={user} onLogout={handleLogout}>
      <h1 className='text-lg font-bold tracking-tight text-slate-900 mb-2'>
        {subTab === 'staff' ? 'ĐỘI NGŨ NHÂN VIÊN' : 'DANH SÁCH KHÁCH HÀNG'}
      </h1>
    </AdminHeader>
  )
}

export default AdminHeaderSection
