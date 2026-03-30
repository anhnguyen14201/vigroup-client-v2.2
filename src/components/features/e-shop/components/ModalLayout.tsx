// components/features/e-shop/modals/Shared/ModalLayout.tsx
import { motion } from 'framer-motion'
import { LayoutGrid, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface ModalLayoutProps {
  title: string
  lang: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  languagesData: any
  onLangChange: (lang: string) => void
}

export const ModalLayout = ({
  title,
  lang,
  isSubmitting,
  onClose,
  onSubmit,
  children,
  languagesData,
  onLangChange,
}: ModalLayoutProps) => (
  <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='relative bg-white w-full max-w-4xl rounded-[40px] flex flex-col max-h-[90vh] overflow-hidden'
    >
      {/* HEADER */}
      <div className='p-7 border-b border-slate-100 bg-white'>
        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-indigo-50 rounded-2xl text-indigo-600'>
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className='text-lg font-black uppercase italic text-slate-900'>
                {title}
              </h2>
              <p className='text-[9px] font-bold text-slate-400 uppercase mt-1'>
                Đang soạn thảo: <span className='text-indigo-600'>{lang}</span>
              </p>
            </div>
          </div>
          {/* LanguageSwitcher and Close button here... */}
        </div>
      </div>

      {/* BODY */}
      <div className='flex-1 overflow-y-auto p-7 custom-scrollbar'>
        <form id='modal-form' onSubmit={onSubmit}>
          {children}
        </form>
      </div>

      {/* FOOTER */}
      <div className='p-7 border-t border-slate-100 bg-white flex gap-3'>
        <Button
          variant='outline'
          onClick={onClose}
          className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase'
        >
          Đóng
        </Button>
        <Button
          type='submit'
          form='modal-form'
          disabled={isSubmitting}
          className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase'
        >
          {isSubmitting ? <Loader2 className='animate-spin' /> : 'Xác nhận'}
        </Button>
      </div>
    </motion.div>
  </div>
)
