'use client'

import { memo, useState } from 'react'
import { User, Search, UserPlus, Phone, Mail, Plus } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import { Field } from '@/components/shared'
import SectionTitle from './SectionTitle'

interface Customer {
  _id: string
  fullName: string
  phone?: string
  email?: string
}

interface ProjectCustomerSectionProps {
  customerData: Customer[]
  isLoading: boolean
  onSearch: (val: string) => void
  // Thông tin khách hàng trong commonData
  customerInfo: {
    customerId?: string
    name: string
    phone: string
    email: string
  }
  onChange: (data: any) => void
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
    })
    setSearchValue(customer.fullName)
    setIsDropdownOpen(false)
  }

  const handleClear = () => {
    onChange({ customerId: undefined, name: '', phone: '', email: '' })
    setSearchValue('')
    setIsDropdownOpen(false)
  }

  return (
    <section className='space-y-4'>
      <SectionTitle icon={User} title='Thông tin khách hàng' />

      <div className='relative'>
        {/* THANH TÌM KIẾM CHÍNH */}
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
            className='rounded-full bg-slate-50 h-10 pl-12 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-indigo-50 disabled:text-indigo-900 disabled:font-bold'
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

        {/* DROPDOWN KẾT QUẢ (Nổi lên trên) */}
        {!isLoading && isDropdownOpen && customerData.length > 0 && (
          <div className='absolute z-110 w-full mt-2 bg-white border rounded-3xl overflow-hidden max-h-60 overflow-y-auto top-full'>
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

      {/* FORM CHI TIẾT - Luôn hiển thị để người dùng nhập tiếp SĐT/Email */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50/50 rounded-4xl border border-dashed border-slate-200'>
        <Field label='Tên hiển thị'>
          <Input
            value={customerInfo.name}
            disabled={!!customerInfo.customerId}
            onChange={e => onChange({ ...customerInfo, name: e.target.value })}
            onFocus={e => e.target.select()}
            className='rounded-full bg-white h-10'
            placeholder='Tên khách hàng...'
          />
        </Field>

        <Field label='Số điện thoại'>
          <div className='relative'>
            <Phone
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
              size={14}
            />
            <Input
              value={customerInfo.phone}
              disabled={!!customerInfo.customerId}
              onChange={e =>
                onChange({ ...customerInfo, phone: e.target.value })
              }
              onFocus={e => e.target.select()}
              className='rounded-full bg-white h-10 pl-10'
              placeholder='Số điện thoại...'
            />
          </div>
        </Field>

        <Field label='Email liên hệ'>
          <div className='relative'>
            <Mail
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
              size={14}
            />
            <Input
              value={customerInfo.email}
              disabled={!!customerInfo.customerId}
              onChange={e =>
                onChange({ ...customerInfo, email: e.target.value })
              }
              onFocus={e => e.target.select()}
              className='rounded-full bg-white h-10 pl-10'
              placeholder='Địa chỉ email...'
            />
          </div>
        </Field>
      </div>
    </section>
  )
}

export default memo(ProjectCustomerSection)
