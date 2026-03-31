'use client'

import {
  InvoicesManagementProvider,
  useInvoicesContext,
} from '@/components/features/invoices/hooks/InvoicesManagementContext'
import { AdminHeader } from '@/components/layouts'
import { LanguageSwitcher, TabSwitcher } from '@/components/shared'
import React from 'react'

const InvoicesManagementContent = () => {
  const {
    user,
    handleLogout,

    subTab,
    tabs,
    setSubTab,
    searchQuery,
    activeLangCode,
    setActiveLangCode,
    isAllQuotations,
    languagesData,
  } = useInvoicesContext()
  return (
    <>
      {' '}
      <AdminHeader user={user} onLogout={handleLogout}>
        <h1 className='text-lg font-bold tracking-tight text-slate-900 mb-2'>
          {isAllQuotations ? 'QUẢN LÝ BÁO GIÁ' : 'QUẢN LÝ BẢO HÀNH'}
        </h1>
      </AdminHeader>
      <div
        className='flex flex-col w-full p-6 font-sans text-slate-900 no-scrollbar overflow-y-auto'
        data-lenis-prevent
      >
        <div className='mx-auto w-full mb-8'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            {/* <div>{isAllQuotations && <ProjectFilters />}</div> */}
            {/* Thống kê số lượng */}

            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
              <LanguageSwitcher
                languagesData={languagesData}
                currentLang={activeLangCode}
                onLangChange={setActiveLangCode}
              />

              <TabSwitcher
                options={tabs}
                activeTab={subTab}
                onChange={id => setSubTab(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProjectManagementPage() {
  return (
    <InvoicesManagementProvider itemsPerPage={8}>
      <InvoicesManagementContent />
    </InvoicesManagementProvider>
  )
}
