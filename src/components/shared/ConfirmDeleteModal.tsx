'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface ConfirmDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  loading?: boolean
}

const ConfirmDeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  title = 'Xác nhận xóa?',
  description = 'Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.',
  loading = false,
}: ConfirmDeleteModalProps) => {
  const onClose = () => {
    if (loading) return
    onOpenChange(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className='fixed inset-0 z-[300] flex items-center justify-center p-4'>
          {/* Backdrop layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='relative bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border-none p-8'
          >
            {/* Close button (Optional) */}
            {!loading && (
              <button
                onClick={onClose}
                className='absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors'
              >
                <X size={18} />
              </button>
            )}

            <div className='flex flex-col items-center text-center space-y-4'>
              {/* Icon cảnh báo */}
              <div className='w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-2'>
                <AlertTriangle size={32} />
              </div>

              <div className='space-y-2'>
                <h3 className='text-xl font-black text-slate-900 uppercase tracking-tight'>
                  {title}
                </h3>
                <p className='text-slate-500 text-sm font-medium leading-relaxed'>
                  {description}
                </p>
              </div>

              {/* Footer Actions */}
              <div className='flex w-full gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={loading}
                  onClick={onClose}
                  className='flex-1 rounded-full h-12 font-bold text-slate-400 border-none bg-slate-100 hover:bg-slate-200 transition-colors'
                >
                  HỦY BỎ
                </Button>
                <Button
                  type='button'
                  disabled={loading}
                  onClick={onConfirm}
                  className='flex-1 rounded-full h-12 font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95'
                >
                  {loading ? (
                    <Loader2 className='h-5 w-5 animate-spin' />
                  ) : (
                    'XÁC NHẬN'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDeleteModal
