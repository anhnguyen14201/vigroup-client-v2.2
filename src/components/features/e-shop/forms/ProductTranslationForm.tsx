import { Field, RichTextEditor } from '@/components/shared'
import { Input, Textarea } from '@/components/ui'
import React from 'react'

const ProductTranslationForm = ({
  currentTranslation,
  handleTranslationChange,
  modalLang,
  seoLength = 0,
}: any) => {
  return (
    <div className='lg:col-span-6 space-y-4'>
      <section className='space-y-4'>
        {/* Tên sản phẩm */}
        <Field label='Tên sản phẩm' required>
          <Input
            value={currentTranslation.productName || ''}
            onChange={e =>
              handleTranslationChange('productName', e.target.value)
            }
            onFocus={e => e.target.select()}
            placeholder='Tên sản phẩm hiển thị...'
            className='rounded-full bg-slate-50 h-11 font-semibold'
          />
        </Field>

        {/* Mô tả SEO */}
        <Field label='Mô tả SEO'>
          <div className='relative'>
            <Textarea
              value={currentTranslation.metaDescription || ''}
              onChange={e =>
                handleTranslationChange('metaDescription', e.target.value)
              }
              onFocus={e => e.target.select()}
              placeholder='Mô tả chuẩn SEO...'
              className='rounded-2xl bg-slate-50 min-h-20 resize-none pb-8'
            />
            <div className='absolute bottom-2 right-4 text-[10px] font-black'>
              <span
                className={seoLength > 160 ? 'text-rose-500' : 'text-slate-400'}
              >
                {seoLength} / 160
              </span>
            </div>
          </div>
        </Field>

        {/* Mô tả ngắn */}
        <Field label='Mô tả ngắn'>
          <RichTextEditor
            key={`short-${modalLang}`}
            value={currentTranslation.shortDesc || ''}
            onChange={val => handleTranslationChange('shortDesc', val)}
          />
        </Field>

        {/* Mô tả chi tiết */}
        <Field label='Mô tả chi tiết'>
          <RichTextEditor
            key={`desc-${modalLang}`}
            value={currentTranslation.desc || ''}
            onChange={val => handleTranslationChange('desc', val)}
          />
        </Field>

        {/* Thông số kỹ thuật */}
        <Field label='Thông số kỹ thuật'>
          <RichTextEditor
            key={`spec-${modalLang}`}
            value={currentTranslation.specifications || ''}
            onChange={val => handleTranslationChange('specifications', val)}
          />
        </Field>
      </section>
    </div>
  )
}

export default ProductTranslationForm
