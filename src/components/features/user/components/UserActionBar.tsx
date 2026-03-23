import { Search, UserPlus } from 'lucide-react'
import { Input, Button } from '@/components'
import { useUserContext } from '../hooks/UserManagementContext'

const UserActionBar = () => {
  const { subTab, searchQuery, setSearchQuery, userRole, handleOpenForm } =
    useUserContext()

  return (
    <div className='max-w-7xl mx-auto w-full mb-10'>
      <div className='flex flex-col md:flex-row items-center gap-4 bg-slate-50/80 p-1 rounded-2xl md:rounded-full border'>
        <div className='relative flex-1 group w-full'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary'
            size={18}
          />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              subTab === 'staff'
                ? 'Tìm tên hoặc số điện thoại...'
                : 'Tìm khách hàng...'
            }
            className='h-11 pl-12 pr-4 border-none rounded-full focus-visible:ring-0 bg-transparent text-sm font-medium w-full shadow-none'
          />
        </div>
        <Button
          disabled={userRole === 'staff'}
          onClick={() => handleOpenForm(null)}
          className='h-11 w-full md:w-auto px-8 cursor-pointer rounded-full font-bold text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 bg-primary text-white'
        >
          <UserPlus size={18} strokeWidth={2.5} />
          <span className='whitespace-nowrap'>
            Thêm {subTab === 'staff' ? 'Nhân viên' : 'Khách hàng'}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default UserActionBar
