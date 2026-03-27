'use client'

import { memo, useMemo } from 'react'
import { Layers, CheckCircle2 } from 'lucide-react'
import { Input, Textarea, Switch } from '@/components/ui'
import { Field, ErrorMessage, RichTextEditor } from '@/components/shared'
import SectionTitle from './SectionTitle'

interface ProjectContentSectionProps {
  globalLang: string
  currentTranslation: {
    name: string
    buildingType: string
    metaDescription: string
    description: string
  }
  isVisible: boolean
  errors: Record<string, string>
  onTranslationChange: (field: string, value: string) => void
  onVisibilityChange: (visible: boolean) => void
}

const ProjectContentSection = ({
  globalLang,
  currentTranslation,
  isVisible,
  errors,
  onTranslationChange,
  onVisibilityChange,
}: ProjectContentSectionProps) => {
  // Tính toán độ dài SEO description để feedback cho user
  const seoLength = useMemo(
    () => currentTranslation?.metaDescription?.length || 0,
    [currentTranslation?.metaDescription],
  )

  return (
    <div className='space-y-4'>
      <SectionTitle
        icon={Layers}
        title={`Nội dung (${globalLang.toUpperCase()})`}
      />

      {/* Tên dự án */}
      <Field label='Tên công trình' required>
        <Input
          value={currentTranslation?.name || ''}
          onChange={e => onTranslationChange('name', e.target.value)}
          onFocus={e => e.target.select()}
          placeholder='Tên dự án hiển thị...'
          className='rounded-full bg-slate-50 h-11 text-base font-semibold focus:ring-2 focus:ring-indigo-500/20'
        />
        <ErrorMessage message={errors[`name_${globalLang}`]} />
      </Field>

      {/* Hạng mục */}
      <Field label='Hạng mục công trình'>
        <Input
          value={currentTranslation?.buildingType || ''}
          onChange={e => onTranslationChange('buildingType', e.target.value)}
          onFocus={e => e.target.select()}
          placeholder='VD: Biệt thự vườn, Chung cư cao cấp...'
          className='rounded-full bg-slate-50 h-11 font-medium focus:ring-2 focus:ring-indigo-500/20'
        />
      </Field>

      {/* SEO Meta Description */}
      <Field label='Mô tả ngắn cho SEO'>
        <div className='relative'>
          <Textarea
            value={currentTranslation?.metaDescription || ''}
            onChange={e =>
              onTranslationChange('metaDescription', e.target.value)
            }
            onFocus={e => e.target.select()}
            placeholder='Nhập mô tả chuẩn SEO (nên từ 150-160 ký tự)...'
            className='rounded-2xl bg-slate-50 min-h-20 resize-none text-sm pb-8 focus:ring-2 focus:ring-indigo-500/20'
          />

          <div className='absolute bottom-2 right-4 flex items-center gap-1.5'>
            <span
              className={`text-[10px] font-black tracking-tighter uppercase ${
                seoLength > 160
                  ? 'text-rose-500'
                  : seoLength >= 140
                    ? 'text-emerald-500'
                    : 'text-slate-400'
              }`}
            >
              {seoLength} / 160
            </span>

            {seoLength >= 140 && seoLength <= 160 && (
              <CheckCircle2 size={10} className='text-emerald-500' />
            )}
          </div>
        </div>

        <p className='text-[9px] font-medium text-slate-400 mt-1 ml-2 italic'>
          * Gợi ý: Độ dài tốt nhất là từ 150 đến 160 ký tự để hiển thị tốt trên
          Google.
        </p>
      </Field>

      {/* Rich Text Editor */}
      <Field label='Mô tả chi tiết'>
        <div className='rounded-2xl overflow-hidden border border-slate-100 bg-white'>
          <RichTextEditor
            value={currentTranslation?.description || ''}
            onChange={content => onTranslationChange('description', content)}
          />
        </div>
      </Field>

      {/* Visibility Toggle */}
      <div className='flex items-center justify-between py-3 px-5 bg-slate-50 rounded-full transition-all hover:bg-slate-100/80'>
        <span className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>
          Trạng thái hiển thị dự án
        </span>
        <Switch checked={isVisible} onCheckedChange={onVisibilityChange} />
      </div>
    </div>
  )
}

export default memo(ProjectContentSection)
