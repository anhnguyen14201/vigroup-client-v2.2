'use client'

import { memo, useState, useCallback } from 'react'
import { User, Search, UserPlus, Building2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui'
import { Field } from '@/components/shared'
import SectionTitle from './SectionTitle'
import { useAresLookup } from '@/hooks'

interface Customer {
  _id: string
  fullName: string
  phone?: string
  email?: string
  ico?: string
  dic?: string
  companyName?: string
  companyAddress?: string
  street?: string
  province?: string
  postalCode?: string
}

interface ProjectCustomerSectionProps {
  customerData: Customer[]
  isLoading: boolean
  onSearch: (val: string) => void
  customerInfo: {
    customerId?: string
    name: string
    phone: string
    email: string
    ico?: string
    dic?: string
    companyName?: string
    companyAddress?: string
    street?: string
    province?: string
    postalCode?: string
  }
  onChange: (
    patch: Partial<ProjectCustomerSectionProps['customerInfo']>,
  ) => void
}

const ProjectCustomerSection = ({
  customerData,
  isLoading,
  onSearch,
  customerInfo,
  onChange,
}: ProjectCustomerSectionProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isExistingCustomer = !!customerInfo.customerId

  const handleSearchChange = (val: string) => {
    setSearchValue(val)
    onSearch(val)
    setIsDropdownOpen(val.trim().length > 0)
  }

  const handleSelectCustomer = (customer: Customer) => {
    onChange({
      customerId: customer._id,
      name: customer.fullName,
      phone: customer.phone || '',
      email: customer.email || '',
      ico: customer.ico || '',
      dic: customer.dic || '',
      companyName: customer.companyName || '',
      companyAddress: customer.companyAddress || '',
      street: customer.street || '',
      province: customer.province || '',
      postalCode: customer.postalCode || '',
    })

    setSearchValue(customer.fullName)
    setIsDropdownOpen(false)
  }

  const handleClear = () => {
    onChange({
      customerId: undefined,
      name: '',
      phone: '',
      email: '',
      ico: '',
      dic: '',
      companyName: '',
      companyAddress: '',
      street: '',
      province: '',
      postalCode: '',
    })
    setSearchValue('')
    setIsDropdownOpen(false)
  }

  const handleAresSuccess = useCallback(
    (data: { companyName?: string; dic?: string; companyAddress?: string }) => {
      onChange({
        companyName: data.companyName || customerInfo.companyName || '',
        dic: data.dic || customerInfo.dic || '',
        companyAddress:
          data.companyAddress || customerInfo.companyAddress || '',
      })
    },
    [
      onChange,
      customerInfo.companyName,
      customerInfo.dic,
      customerInfo.companyAddress,
    ],
  )

  const { isFetching } = useAresLookup({
    ico: customerInfo.ico,
    enabled: !!customerInfo.ico?.trim(),
    onSuccess: handleAresSuccess,
  })

  return (
    <section className='space-y-4'>
      <SectionTitle icon={User} title='Thông tin khách hàng' />

      <div className='relative'>
        <div className='relative'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Nhập vào tên, số điện thoại hoặc email...'
            value={customerInfo.customerId ? customerInfo.name : searchValue}
            disabled={!!customerInfo.customerId}
            onFocus={e => e.target.select()}
            onChange={e => handleSearchChange(e.target.value)}
            className='rounded-full bg-slate-50 h-10 pl-12 disabled:bg-indigo-50 disabled:text-indigo-900'
          />

          {customerInfo.customerId && (
            <button
              onClick={handleClear}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-rose-500 hover:underline'
            >
              Thay đổi
            </button>
          )}
        </div>

        {!isLoading && isDropdownOpen && customerData.length > 0 && (
          <div className='absolute z-110 w-full mt-2 bg-white border shadow-xl rounded-3xl overflow-hidden max-h-60 overflow-y-auto top-full'>
            {customerData.map(c => (
              <div
                key={c._id}
                onClick={() => handleSelectCustomer(c)}
                className='px-6 py-4 hover:bg-indigo-50/50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-none'
              >
                <div>
                  <p className='font-bold text-slate-900'>{c.fullName}</p>
                  <p className='text-[10px] text-slate-500 uppercase'>
                    {c.phone || 'N/A'}
                  </p>
                </div>
                <UserPlus size={16} className='text-indigo-500' />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 gap-6 p-6 bg-slate-50/50 rounded-4xl border border-dashed border-slate-200'>
        <div className='space-y-4'>
          <p className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>
            Cá nhân
          </p>

          <Field label='Tên hiển thị'>
            <Input
              value={customerInfo.name}
              onChange={e => onChange({ name: e.target.value })}
              onFocus={e => e.target.select()}
              className='rounded-full bg-white h-10'
              placeholder='Tên khách hàng...'
            />
          </Field>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='Số điện thoại'>
              <Input
                disabled={isExistingCustomer}
                value={customerInfo.phone}
                onChange={e => onChange({ phone: e.target.value })}
                onFocus={e => e.target.select()}
                className='rounded-full bg-white h-10'
                placeholder='SĐT...'
              />
            </Field>

            <Field label='Email'>
              <Input
                value={customerInfo.email}
                disabled={isExistingCustomer}
                onChange={e => onChange({ email: e.target.value })}
                onFocus={e => e.target.select()}
                className='rounded-full bg-white h-10'
                placeholder='Email...'
              />
            </Field>
          </div>

          <Field label='Địa chỉ cá nhân'>
            <div className='grid grid-cols-1 gap-3'>
              {/* Hàng 1: Đường & Số nhà */}
              <Input
                value={customerInfo.street || ''}
                onChange={e => onChange({ street: e.target.value })}
                onFocus={e => e.target.select()}
                className='rounded-full bg-white h-11 border-slate-200 focus:border-indigo-500 transition-all'
                placeholder='Số nhà, tên đường...'
              />

              {/* Hàng 2: Thành phố & Mã bưu điện */}
              <div className='grid grid-cols-2 gap-3'>
                <Input
                  value={customerInfo.province || ''}
                  onChange={e => onChange({ province: e.target.value })}
                  onFocus={e => e.target.select()}
                  className='rounded-full bg-white h-11 border-slate-200 focus:border-indigo-500 transition-all'
                  placeholder='Thành phố / Tỉnh'
                />
                <Input
                  value={customerInfo.postalCode || ''}
                  onChange={e => onChange({ postalCode: e.target.value })}
                  className='rounded-full bg-white h-11 border-slate-200 focus:border-indigo-500 transition-all text-center'
                  placeholder='Mã bưu điện (PSC)'
                />
              </div>
            </div>
          </Field>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 p-6 bg-slate-50/50 rounded-4xl border border-dashed border-slate-200'>
        <div className='space-y-4 border-slate-200'>
          <p className='text-[10px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2'>
            <Building2 size={14} /> Thôn tin công ty
          </p>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='Mã số thuế (ICO)'>
              <div className='relative'>
                <Input
                  value={customerInfo.ico || ''}
                  onFocus={e => e.target.select()}
                  onChange={e => onChange({ ico: e.target.value })}
                  placeholder='ICO...'
                  className='rounded-full bg-white h-10 border-indigo-100'
                />
                {isFetching && (
                  <Loader2
                    size={14}
                    className='absolute right-3 top-3 animate-spin text-indigo-500'
                  />
                )}
              </div>
            </Field>

            <Field label='DIC'>
              <Input
                value={customerInfo.dic || ''}
                onFocus={e => e.target.select()}
                onChange={e => onChange({ dic: e.target.value })}
                placeholder='CZ...'
                className='rounded-full bg-white h-10'
              />
            </Field>
          </div>

          <Field label='Tên công ty'>
            <Input
              value={customerInfo.companyName || ''}
              onFocus={e => e.target.select()}
              onChange={e => onChange({ companyName: e.target.value })}
              className='rounded-full bg-white h-10'
              placeholder='Tên doanh nghiệp...'
            />
          </Field>

          <Field label='Địa chỉ trụ sở'>
            <Input
              value={customerInfo.companyAddress || ''}
              onFocus={e => e.target.select()}
              onChange={e => onChange({ companyAddress: e.target.value })}
              className='rounded-full bg-white h-10 text-xs italic'
              placeholder='Địa chỉ ARES...'
            />
          </Field>
        </div>
      </div>
    </section>
  )
}

export default memo(ProjectCustomerSection)
