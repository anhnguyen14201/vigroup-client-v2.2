import { motion } from 'framer-motion'
import { Loader2, Filter } from 'lucide-react'
import UserCard from './UserCard'
import { useUserContext } from '../hooks/UserManagementContext'
import { EmptyState, LoadingState } from '@/components/shared'

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
    return <LoadingState />
  }

  if (displayUsers.length === 0) {
    return <EmptyState />
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
