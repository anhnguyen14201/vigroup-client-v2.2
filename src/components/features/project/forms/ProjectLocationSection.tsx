'use client'

import { memo } from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui'
import { Field } from '@/components/shared'
import SectionTitle from './SectionTitle'

interface ProjectLocationSectionProps {
  location: string
  longitude: string
  latitude: string
  // Truyền hàm update chung để tiết kiệm việc tạo nhiều handler nhỏ
  onChange: (field: string, value: string) => void
}

const ProjectLocationSection = ({
  location,
  longitude,
  latitude,
  onChange,
}: ProjectLocationSectionProps) => {
  return (
    <section className='space-y-4'>
      <SectionTitle icon={MapPin} title='Vị trí địa lý' />

      <Field label='Địa chỉ'>
        <Input
          value={location}
          onChange={e => onChange('location', e.target.value)}
          onFocus={e => e.target.select()}
          placeholder='VD: 123 Street, Prague, Czech Republic'
          className='rounded-full bg-slate-50 border-none h-11 font-medium focus:ring-2 focus:ring-indigo-500/20'
        />
      </Field>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          placeholder='Kinh độ (Long)'
          value={longitude}
          onChange={e => onChange('longitude', e.target.value)}
          onFocus={e => e.target.select()}
          className='rounded-full bg-slate-50 border-none h-10 focus:ring-2 focus:ring-indigo-500/20'
        />
        <Input
          placeholder='Vĩ độ (Lat)'
          value={latitude}
          onChange={e => onChange('latitude', e.target.value)}
          onFocus={e => e.target.select()}
          className='rounded-full bg-slate-50 border-none h-10 focus:ring-2 focus:ring-indigo-500/20'
        />
      </div>
    </section>
  )
}

export default memo(ProjectLocationSection)
