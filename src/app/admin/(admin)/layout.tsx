'use client'

import { useMemo } from 'react'

import '@/app/globals.css'
import { SidebarInset, SidebarProvider } from '@/components/ui'
import { ClientSidebar } from '@/components'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const allowedRoles = useMemo(
    () => [3515, 1413914, 1311417518, 23521311920518],
    [],
  )

  return (
    <div
      className='bg-gray-50 text-gray-900 font-sans'
      suppressHydrationWarning
    >
      {/* <AuthProvider
        allowedRoles={allowedRoles}
        fallbackPath='app'
        target='merchant'
      > */}
      <div className='bg-gray-50 text-gray-900 font-sans overflow-y-auto no-scrollbar h-screen'>
        <SidebarProvider>
          <ClientSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>
      {/* </AuthProvider> */}
    </div>
  )
}
