import { UserPlus } from 'lucide-react'
import { GenericActionBar } from '@/components/shared/GenericActionBar' // Đường dẫn tới file chung
import { useUserContext } from '../hooks/UserManagementContext'

const UserActionBar = () => {
  const { subTab, searchQuery, setSearchQuery, userRole, handleOpenForm } =
    useUserContext()

  // Xác định nội dung động dựa trên subTab
  const isStaff = subTab === 'staff'

  return (
    <GenericActionBar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder={
        isStaff ? 'Tìm tên hoặc số điện thoại...' : 'Tìm khách hàng...'
      }
      buttonLabel={`Thêm ${isStaff ? 'Nhân viên' : 'Khách hàng'}`}
      buttonIcon={UserPlus}
      onButtonClick={() => handleOpenForm(null)}
      disabled={userRole === 'staff'}
    />
  )
}

export default UserActionBar
