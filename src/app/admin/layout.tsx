'use client'

import { Toaster } from 'sonner'

import {
  InitialLoader,
  PageTransitionWrapper,
  ProgressProvider,
} from '@/providers'

import '@/app/globals.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Toaster position='top-center' expand={false} richColors />{' '}
      <InitialLoader>
        <PageTransitionWrapper>
          <ProgressProvider>{children}</ProgressProvider>
        </PageTransitionWrapper>
      </InitialLoader>
    </>
  )
}
