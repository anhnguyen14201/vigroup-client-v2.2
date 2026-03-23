'use client'

import { LogOut, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@/components/ui'

interface LogoutConfirmModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  userName?: string
}

export default function LogoutConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  userName,
}: LogoutConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className='max-w-[400px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl'>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header Visual */}
              <div className='relative h-32 bg-slate-50 flex items-center justify-center'>
                {/* Background Decor */}
                <div
                  className='absolute inset-0 opacity-10'
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                <motion.div
                  initial={{ rotate: -10, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className='relative z-10 h-20 w-20 bg-white rounded-3xl shadow-xl shadow-rose-500/10 flex items-center justify-center group'
                >
                  <div className='absolute inset-0 bg-rose-500/5 rounded-3xl group-hover:scale-110 transition-transform duration-500' />
                  <LogOut className='h-10 w-10 text-rose-500' />
                </motion.div>

                <div className='absolute top-4 right-4'>
                  <AlertCircle className='h-5 w-5 text-slate-300 animate-pulse' />
                </div>
              </div>

              <div className='p-8 pt-6'>
                <AlertDialogHeader className='space-y-3'>
                  <AlertDialogTitle className='text-2xl font-bold text-center text-slate-900'>
                    Bạn muốn đăng xuất?
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-slate-500 text-center text-base leading-relaxed'>
                    Phiên làm việc của{' '}
                    <span className='font-semibold text-slate-800 inline-block px-1.5 py-0.5 bg-slate-100 rounded-md'>
                      {userName || 'tài khoản'}
                    </span>{' '}
                    sẽ kết thúc. Bạn có chắc chắn không?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className='flex-col sm:flex-row gap-3 mt-8'>
                  <Button
                    onClick={() => onOpenChange(false)}
                    className='flex-1 h-12 rounded-full border-none bg-slate-100 text-slate-600 cursor-pointer
                            hover:bg-slate-200 hover:text-slate-900 font-semibold transition-all duration-200'
                  >
                    Để sau đi
                  </Button>
                  <Button
                    onClick={onConfirm}
                    className='flex-1 h-12 rounded-full bg-slate-900 text-white hover:bg-primary font-semibold 
                                transition-all duration-300 cursor-pointer'
                  >
                    Đăng xuất ngay
                  </Button>
                </AlertDialogFooter>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AlertDialogContent>
    </AlertDialog>
  )
}
