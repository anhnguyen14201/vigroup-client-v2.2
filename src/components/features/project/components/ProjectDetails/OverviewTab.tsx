import CashflowCard from '@/components/features/project/components/ProjectDetails/CashflowCard'
import CustomerCard from '@/components/features/project/components/ProjectDetails/CustomerCard'
import OperationalCard from '@/components/features/project/components/ProjectDetails/OperationalCard'
import { TabsContent } from '@/components/ui'
import { formatCurrency } from '@/utils'
import { Car, Clock, HardHat, Package, TrendingUp } from 'lucide-react'

const OverviewTab = ({ project, totalInvoiceAmount, totalItems }: any) => {
  const totalWorkHours =
    project?.employees?.reduce(
      (acc: number, emp: any) => acc + (emp.totalHours || 0),
      0,
    ) || 0
  return (
    <TabsContent
      value='overview'
      className='m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <OperationalCard
          icon={<HardHat size={20} />}
          label='Tổng lương nhân sự'
          value={formatCurrency(project?.totalSalaryDue)}
          subtext={`${project?.employees?.length} nhân công`}
          color='blue'
        />
        <OperationalCard
          icon={<Package size={20} />}
          label='Tổng hóa đơn vật tư'
          value={formatCurrency(totalInvoiceAmount)}
          subtext={`${totalItems} hóa đơn`}
          color='orange'
        />
        <OperationalCard
          icon={<Clock size={20} />}
          label='Tổng giờ làm việc'
          value={`${totalWorkHours.toFixed(1)}`} // Làm tròn 1 chữ số thập phân
          unit='h'
          subtext='Tổng số giờ làm của toàn đội'
          color='purple'
        />

        <OperationalCard
          icon={<TrendingUp size={20} />}
          label='Tiến độ thực tế'
          value={project?.status === 'finished' ? 100 : 0} // Ví dụ logic tiến độ
          unit='%'
          subtext={
            project?.status === 'finished' ? 'Đã hoàn thành' : 'Đang triển khai'
          }
          color='emerald'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <CustomerCard project={project} />
        <CashflowCard project={project} />
      </div>
    </TabsContent>
  )
}

export default OverviewTab
