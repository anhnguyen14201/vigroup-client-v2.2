'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X, LayoutGrid } from 'lucide-react'
import { LanguageSwitcher } from '@/components/shared'
import { Button } from '@/components/ui'

type Props = {
  title: string
  modalLang: string
  setModalLang: (lang: string) => void
  languagesData: any[]
  onClose: () => void
  isSubmitting?: boolean
  onSubmit: (e?: React.FormEvent) => void
  children: React.ReactNode
  submitText: string
}

export const EntityModalShell = ({
  title,
  modalLang,
  setModalLang,
  languagesData,
  onClose,
  isSubmitting,
  onSubmit,
  children,
  submitText,
}: Props) => {
  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className='relative bg-white w-full max-w-4xl rounded-[40px] flex flex-col border border-slate-100 overflow-hidden max-h-[90vh]'
      >
        <div className='shrink-0 p-7 border-b border-slate-100 bg-white'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-indigo-50 rounded-2xl text-indigo-600'>
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className='text-lg font-black uppercase italic text-slate-900 leading-tight'>
                  {title}
                </h2>
                <p className='text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1'>
                  Đang soạn thảo:{' '}
                  <span className='text-indigo-600'>{modalLang}</span>
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <LanguageSwitcher
                languagesData={languagesData}
                currentLang={modalLang}
                onLangChange={setModalLang}
              />
              <button
                onClick={onClose}
                className='p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full'
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-7'>{children}</div>

        <div className='shrink-0 p-7 border-t border-slate-100 bg-white'>
          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase'
            >
              Đóng
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              onClick={onSubmit as any}
              className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase'
            >
              {submitText}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
