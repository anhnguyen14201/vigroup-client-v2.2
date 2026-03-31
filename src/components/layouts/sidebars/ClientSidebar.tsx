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
  FolderKanban,
  Box,
  HardHat,
  Palette,
  PackageSearch,
  ShoppingCart,
  Wind,
  Globe,
  Building2, // Icon cho Dịch vụ
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

  const getAppUrl = React.useCallback((path: string) => `/admin${path}`, [slug])

  const navData = React.useMemo(
    () => ({
      navMain: [
        {
          title: 'Dashboard',
          url: getAppUrl('/dashboard'),
          icon: LayoutDashboard,
        },
        // --- NHÓM VẬN HÀNH DỰ ÁN (Core Business) ---
        {
          title: 'Dự án',
          url: getAppUrl('/projects'),
          icon: FolderKanban,
        },
        {
          title: 'Vật tư',
          url: getAppUrl('/materials'),
          icon: Box,
        },
        {
          title: 'Thiết bị',
          url: getAppUrl('/equipments'),
          icon: HardHat,
        },
        {
          title: 'Mẫu thiết kế',
          url: getAppUrl('/designs'),
          icon: Palette,
        },
        // --- NHÓM BÁN HÀNG & E-SHOP (Revenue) ---
        {
          title: 'E-Shop',
          url: getAppUrl('/e-shop'),
          icon: PackageSearch,
        },
        {
          title: 'Đơn hàng',
          url: getAppUrl('/orders'),
          icon: ShoppingCart,
        },
        {
          title: 'Hóa đơn & Bảo hành',
          url: getAppUrl('/invoices'), // Lưu ý: Để chữ thường /invoices cho đồng bộ
          icon: FileText, // Thay Wind bằng FileText sẽ đúng nghĩa hóa đơn hơn
        },
        // --- NHÓM QUẢN TRỊ (Administration) ---
        {
          title: 'Người dùng',
          url: getAppUrl('/users'),
          icon: Users2,
        },
        // --- NHÓM CẤU HÌNH (Settings) ---
        {
          title: 'SEO',
          url: getAppUrl('/seo-settings'),
          icon: Globe,
        },
        {
          title: 'Thông tin công ty',
          url: getAppUrl('/company-info'),
          icon: Building2,
        },
      ],
    }),
    [getAppUrl],
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
