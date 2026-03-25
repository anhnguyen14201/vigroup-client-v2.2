'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps {
  icon?: LucideIcon
  onClick: () => void
  show?: boolean // Để kiểm soát ẩn hiện nếu cần
  className?: string
}

const FloatingActionButton = ({
  icon: Icon = Plus, // Mặc định là dấu cộng nếu không truyền icon
  onClick,
  show = true,
  className,
}: FABProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className={cn(
            'md:hidden fixed bottom-8 right-6 z-10',
            'w-14 h-14 bg-primary text-white rounded-full shadow-2xl',
            'flex items-center justify-center border-white active:bg-primary',
            'transition-colors duration-200',
            className,
          )}
        >
          <Icon size={24} strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default FloatingActionButton
