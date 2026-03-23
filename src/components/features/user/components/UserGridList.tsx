import { motion } from 'framer-motion'
import { Loader2, Filter } from 'lucide-react'
import UserCard from './UserCard'
import { useUserContext } from '../hooks/UserManagementContext'

const UserGridList = () => {
  const {
    displayUsers,
    isLoading,
    subTab,
    handleOpenForm,
    setDeleteId,
    handleViewDetail,
  } = useUserContext()

  if (isLoading) {
    return (
      <div className='h-64 flex flex-col items-center justify-center text-primary'>
        <Loader2 className='w-10 h-10 animate-spin mb-2' />
        <p className='font-medium animate-pulse'>Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (displayUsers.length === 0) {
    return (
      <div
        className='bg-white/50 border-2 border-dashed border-slate-300 rounded-[40px] 
                  h-64 flex flex-col items-center justify-center text-slate-400'
      >
        <Filter size={48} strokeWidth={1} className='mb-4' />
        <p className='font-bold italic text-sm'>
          Không tìm thấy dữ liệu phù hợp
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 '>
      {displayUsers.map((item: any, index: any) => (
        <motion.div
          key={item?.employeeId || item?._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <UserCard
            user={item}
            type={subTab}
            onEdit={handleOpenForm}
            onDelete={setDeleteId}
            onDetail={handleViewDetail}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default UserGridList
