import React from 'react'
import { Input, Textarea } from '@/components/ui'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  label: string
  langCode: string
  nameValue: string
  descValue: string
  onNameChange: (val: string) => void
  onDescChange: (val: string) => void
  placeholderName?: string
  placeholderDesc?: string
}

const TranslatableSEOInput = ({
  label,
  langCode,
  nameValue,
  descValue,
  onNameChange,
  onDescChange,
  placeholderName = 'Nhập tên...',
  placeholderDesc = 'Nhập mô tả chuẩn SEO...',
}: Props) => {
  const seoLength = descValue?.length || 0

  return (
    <div className='space-y-6'>
      {/* Input Tên */}
      <div className='space-y-2'>
        <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
          {label} ({langCode})
        </label>
        <Input
          required
          autoFocus
          value={nameValue || ''} // Chống lỗi Uncontrolled
          onChange={e => onNameChange(e.target.value)}
          onFocus={e => e.target.select()}
          placeholder={placeholderName}
          className='h-12 bg-slate-50 rounded-full px-5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20'
        />
      </div>

      {/* Textarea Mô tả SEO */}
      <div className='space-y-2'>
        <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
          Mô tả ngắn cho SEO ({langCode})
        </label>
        <div className='relative'>
          <Textarea
            value={descValue || ''} // Chống lỗi Uncontrolled
            onChange={e => onDescChange(e.target.value)}
            onFocus={e => e.target.select()}
            placeholder={placeholderDesc}
            className='rounded-2xl bg-slate-50 min-h-24 resize-none text-sm p-5 pb-10 focus:ring-2 focus:ring-indigo-500/20'
          />

          <div className='absolute bottom-3 right-5 flex items-center gap-1.5'>
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
              <CheckCircle2 size={12} className='text-emerald-500' />
            )}
          </div>
        </div>
        <p className='text-[9px] font-medium text-slate-400 mt-1 ml-2 italic leading-relaxed'>
          * Gợi ý: Độ dài tốt nhất là từ 150 đến 160 ký tự để hiển thị tốt trên
          Google.
        </p>
      </div>
    </div>
  )
}

export default TranslatableSEOInput
