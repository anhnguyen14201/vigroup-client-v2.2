'use client'

import { memo } from 'react'
import { Settings2, DollarSign } from 'lucide-react'
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { Field, ErrorMessage } from '@/components/shared' // Đảm bảo đúng path component của bạn
import SectionTitle from './SectionTitle'

interface ProjectTechnicalSectionProps {
  commonData: {
    projectCode: string
    category: string
    contractAmount: string | number
    nightShiftCoeff: string | number
  }
  errors: Record<string, string>
  allProjectTypes: any[]
  selectedProjectType: any
  onProjectCodeChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onCommonDataChange: (field: string, value: any) => void
}

const ProjectTechnicalSection = ({
  commonData,
  errors,
  allProjectTypes,
  selectedProjectType,
  onProjectCodeChange,
  onCategoryChange,
  onCommonDataChange,
}: ProjectTechnicalSectionProps) => {
  return (
    <section>
      <SectionTitle icon={Settings2} title='Cấu hình kỹ thuật' />

      <div className='grid grid-cols-2 gap-4 mt-6'>
        {/* Mã dự án */}
        <Field label='Mã dự án' required>
          <Input
            autoFocus
            value={commonData.projectCode}
            onChange={e => onProjectCodeChange(e.target.value)}
            onFocus={e => e.target.select()}
            placeholder='VIGROUP-2026'
            className='rounded-full font-semibold bg-slate-50  h-10 focus:ring-2 focus:ring-indigo-500/20'
          />
          <ErrorMessage message={errors.projectCode} />
        </Field>

        {/* Kiểu dự án */}
        <Field label='Kiểu dự án' required>
          <Select value={commonData.category} onValueChange={onCategoryChange}>
            <SelectTrigger className='w-full z-1000 rounded-full bg-slate-50  h-10 px-5 font-semibold focus:ring-indigo-500/20 outline-none shadow-none cursor-pointer'>
              <SelectValue>
                {selectedProjectType?.translations?.find(
                  (t: any) => t.language?.code === 'vi',
                )?.name ?? 'Chọn loại dự án'}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              position='popper'
              sideOffset={0}
              className='rounded-xl border-slate-100 z-1000 bg-white'
            >
              {allProjectTypes?.map((type: any) => {
                const viName =
                  type.translations?.find((t: any) => t.language.code === 'vi')
                    ?.name || type.name

                return (
                  <SelectItem
                    key={type._id}
                    value={type._id}
                    className='text-xs font-medium cursor-pointer'
                  >
                    {viName}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <ErrorMessage message={errors.category} />
        </Field>
      </div>

      <div className='grid grid-cols-2 gap-4 mt-4'>
        {/* Khoán dự án */}
        <Field label='Khoán dự án (Kč)'>
          <div className='relative'>
            <Input
              type='number'
              value={commonData.contractAmount}
              onChange={e =>
                onCommonDataChange('contractAmount', e.target.value)
              }
              onFocus={e => e.target.select()}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              className='rounded-full bg-slate-50  h-10 pl-10 focus:ring-2 focus:ring-indigo-500/20'
            />
            <DollarSign
              size={14}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
            />
          </div>
        </Field>

        {/* Hệ số ca đêm */}
        <Field label='Hệ số ca đêm'>
          <Input
            type='number'
            value={commonData.nightShiftCoeff}
            onChange={e =>
              onCommonDataChange('nightShiftCoeff', e.target.value)
            }
            onFocus={e => e.target.select()}
            onWheel={e => (e.target as HTMLInputElement).blur()}
            className='rounded-full bg-slate-50  h-10 focus:ring-2 focus:ring-indigo-500/20'
          />
        </Field>
      </div>
    </section>
  )
}

export default memo(ProjectTechnicalSection)
