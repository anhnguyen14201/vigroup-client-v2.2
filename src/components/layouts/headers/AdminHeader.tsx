'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarTrigger,
} from '@/components/ui'
import { getInitials, getRoleDetails } from '@/utils'
import { LogoutConfirmModal } from '@/components/shared'

interface AdminHeaderProps {
  user: {
    fullName: string
    role: number
    phone: number
    email: string
    image?: string
  }
  onLogout: () => void
  children?: React.ReactNode
}

export function AdminHeader({ user, onLogout, children }: AdminHeaderProps) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const roleInfo = getRoleDetails(user?.role)

  return (
    <>
      <header
        className='flex h-16 shrink-0 items-center justify-between gap-4 border-b 
                  bg-white/70 backdrop-blur-xl px-6 sticky top-0 z-40 transition-all'
      >
        <div className='flex items-center gap-4 flex-1'>
          <SidebarTrigger
            className='-ml-2 h-9 w-9 text-slate-500 hover:text-primary 
                      hover:bg-primary/10 transition-all rounded-full'
          />
          <div className='w-full max-w-sm flex items-center justify-center sm:block'>
            {children}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='group p-1 pr-2 h-auto rounded-full hover:bg-slate-100 
                          data-[state=open]:bg-slate-100 transition-all cursor-pointer'
              >
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <Avatar
                      className='h-9 w-9 border-2 border-white shadow-sm 
                                group-hover:ring-2 ring-primary/20 transition-all'
                    >
                      <AvatarImage src={user?.image} className='object-cover' />
                      <AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
                        {getInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className='absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 
                                border-2 border-white rounded-full'
                    />
                  </div>

                  <div className='hidden flex-col items-start md:flex text-left leading-tight'>
                    <span
                      className='text-sm font-semibold text-slate-900 truncate 
                                max-w-30'
                    >
                      {user?.fullName}
                    </span>
                    <span className='text-[10px] font-medium text-slate-500'>
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown
                    className='h-4 w-4 text-slate-400 
                              group-hover:text-slate-600 transition-colors'
                  />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-64 p-0 mt-2 overflow-hidden rounded-xl border-slate-200'
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {/* Profile Header Section */}
                <div className='bg-primary-hover p-5 text-white'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-12 w-12 border-2 border-white/20'>
                      <AvatarImage src={user?.image} />
                      <AvatarFallback className='bg-primary/20 text-white'>
                        {getInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-0.5 overflow-hidden'>
                      <p className='text-sm font-bold truncate'>
                        {user?.fullName}
                      </p>
                      <p className='text-[11px] text-slate-200 truncate italic'>
                        {user?.phone || user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className='p-2 bg-white'>
                  {/* <DropdownMenuItem
                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg 
                              cursor-pointer text-slate-700 hover:bg-slate-50'
                  >
                    <UserIcon className='h-4 w-4 text-slate-400' />
                    <span className='text-sm font-medium'>Hồ sơ cá nhân</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg 
                              cursor-pointer text-slate-700 hover:bg-slate-50'
                  >
                    <Settings className='h-4 w-4 text-slate-400' />
                    <span className='text-sm font-medium'>
                      Cài đặt tài khoản
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className='my-1 bg-slate-100' /> */}

                  <DropdownMenuItem
                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer 
                              text-rose-600 focus:text-rose-600 focus:bg-rose-50'
                    onSelect={e => {
                      e.preventDefault()
                      setIsLogoutOpen(true)
                    }}
                  >
                    <LogOut className='h-4 w-4' />
                    <span className='text-sm font-bold'>
                      Đăng xuất hệ thống
                    </span>
                  </DropdownMenuItem>
                </div>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modern Alert Logout */}
      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onConfirm={onLogout}
        userName={user?.fullName}
      />
    </>
  )
}
