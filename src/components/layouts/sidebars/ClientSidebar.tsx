'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  CalendarDays,
  Users2,
  TicketPercent,
  FileText,
  MapPin,
  Settings2,
  Scissors,
  FolderKanban, // Icon cho Dịch vụ
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui'
import { NavMain } from '@/components/layouts/shared'

export function ClientSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const [isSupportOpen, setIsSupportOpen] = React.useState(false)

  const getAppUrl = React.useCallback((path: string) => `/admin${path}`, [slug])
  const getPosUrl = React.useCallback(
    (path: string) => `/pos/${slug}${path}`,
    [slug],
  )

  const navData = React.useMemo(
    () => ({
      navMain: [
        {
          title: 'Dashboard',
          url: getAppUrl('/dashboard'),
          icon: LayoutDashboard,
        },
        { title: 'Người dùng', url: getAppUrl('/users'), icon: Users2 },
        { title: 'Dự án', url: getAppUrl('/projects'), icon: FolderKanban },
        { title: 'Đặt lịch', url: getAppUrl('/bookings'), icon: CalendarDays },
        { title: 'Dịch vụ', url: getAppUrl('/services'), icon: Scissors }, // THÊM DỊCH VỤ
        {
          title: 'Khuyến mãi',
          url: getAppUrl('/promotions'),
          icon: TicketPercent,
        },
        { title: 'Hóa đơn', url: getAppUrl('/invoices'), icon: FileText },
        { title: 'Chi nhánh', url: getAppUrl('/branches'), icon: MapPin },
        { title: 'Cài đặt', url: getAppUrl('/settings'), icon: Settings2 },
      ],
    }),
    [getAppUrl, getPosUrl],
  )

  return (
    <>
      <Sidebar collapsible='icon' {...props}>
        <SidebarHeader className='py-4 px-2 border-b group-data-[collapsible=icon]:px-0'>
          <div className='flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              <Store className='h-5 w-5' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
              <span className='truncate font-bold uppercase tracking-wider text-primary'>
                {slug}
              </span>
              <span className='truncate text-[10px] font-medium text-muted-foreground'>
                ANGEN POS SYSTEM
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={navData.navMain} />
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      {/* Modal Hỗ trợ */}
      {/*       <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      /> */}
    </>
  )
}
