import { TabSwitcher } from '@/components/shared'
import { useUserContext } from '../hooks/UserManagementContext'
import { ShieldCheck, Users } from 'lucide-react'

const UserHeaderSection = () => {
  const { subTab, setSubTab } = useUserContext()

  const tabs = [
    {
      id: 'staff',
      label: 'Nhân viên',
      icon: ShieldCheck,
      activeColor: 'text-primary',
    },
    {
      id: 'customer',
      label: 'Khách hàng',
      icon: Users,
      activeColor: 'text-indigo-600',
    },
  ]

  return (
    <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
      <TabSwitcher
        options={tabs}
        activeTab={subTab}
        onChange={id => setSubTab(id)}
      />
    </div>
  )
}

export default UserHeaderSection
