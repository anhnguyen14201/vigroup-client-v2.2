'use client'

import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import Link from 'next/link'
import {
  useSidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui'

export function NavMain({ items }: { items: any[] }) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar() // Lấy thêm isMobile để xử lý riêng
  const isCollapsed = state === 'collapsed'

  const baseBtn =
    'flex items-center gap-2 w-full px-3 py-2 rounded transition font-medium text-sm cursor-pointer'
  const activeBtn = 'bg-primary text-primary-foreground font-semibold'
  const inactiveBtn = 'text-slate-600 hover:bg-slate-100 hover:text-primary'

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => {
          const isActive = item.url
            ? pathname === item.url || pathname.startsWith(item.url + '/')
            : false
          const hasBadge =
            item.badge !== undefined && item.badge !== null && item.badge > 0

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={clsx(
                  baseBtn,
                  isActive ? activeBtn : inactiveBtn,
                  'relative',
                )}
              >
                <Link
                  href={item?.url || '#'}
                  target={item.target} // Nhận target từ dữ liệu (vd: '_blank')
                  rel={
                    item.target === '_blank' ? 'noopener noreferrer' : undefined
                  } // Bảo mật cho tab mới
                  className='flex items-center w-full'
                >
                  {/* PHẦN ICON */}
                  <div className='relative flex items-center justify-center'>
                    {item.icon && <item.icon className='w-4 h-4 shrink-0' />}

                    {/* Badge mini: Chỉ hiện khi Collapsed TRÊN DESKTOP */}
                    {isCollapsed && !isMobile && hasBadge && (
                      <span
                        className='absolute -top-1.5 -right-1.5 flex h-4 min-w-4 
                                  items-center justify-center rounded-full bg-primary px-1 
                                  text-[8px] font-bold text-white ring-1 ring-white'
                      >
                        {item.badge! > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>

                  {/* PHẦN TEXT: 
                      1. Luôn hiện trên Mobile (isMobile)
                      2. Trên Desktop: Ẩn khi collapsed (group-data-[collapsible=icon]:hidden)
                  */}
                  <span
                    className={clsx(
                      'flex-1 ml-2 text-left truncate transition-opacity',
                      isCollapsed && !isMobile ? 'md:hidden' : 'opacity-100',
                    )}
                  >
                    {item.title}
                  </span>

                  {/* BADGE LỚN: Hiện khi không collapsed hoặc đang ở Mobile */}
                  {hasBadge && (!isCollapsed || isMobile) && (
                    <span
                      className={clsx(
                        'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ring-2 ring-white',
                        isActive
                          ? 'bg-white text-primary'
                          : 'bg-primary text-white',
                      )}
                    >
                      {item.badge! > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
