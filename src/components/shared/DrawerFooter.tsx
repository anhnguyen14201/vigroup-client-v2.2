import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

interface DrawerFooterProps {
  onCancel: () => void
  saveText?: string
  cancelText?: string
  isSubmitting?: boolean
  variants?: any // animation variants
}

const DrawerFooter = ({
  onCancel,
  saveText = 'Lưu',
  cancelText = 'Hủy',
  isSubmitting = false,
  variants,
}: DrawerFooterProps) => {
  return (
    <motion.div variants={variants} className='flex gap-3 pt-2 pb-10'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isSubmitting}
        className='flex-1 h-12 rounded-full font-bold text-slate-400 border 
                  hover:bg-slate-50 cursor-pointer'
      >
        {cancelText}
      </Button>
      <Button
        type='submit'
        disabled={isSubmitting}
        className='flex-1 h-12 rounded-full font-bold bg-primary text-white 
                  hover:bg-primary-hover transition-all cursor-pointer'
      >
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <span className='animate-spin'>...</span> {saveText}
          </span>
        ) : (
          saveText
        )}
      </Button>
    </motion.div>
  )
}

export default DrawerFooter
