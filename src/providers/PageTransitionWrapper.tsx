'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { useLoadingStore } from '@/stores/loadingStore'

// dùng chung transition để đồng bộ mask
const revealTransition: MotionProps['transition'] = {
  duration: 1.2, // 2s cho chậm, mượt
  ease: [0.32, 0.04, 0.66, 0.38],
}

export default function PageTransitionWrapper({ children }: any) {
  const { loading } = useLoadingStore()

  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    if (!loading) {
      setReveal(true)
    }
  }, [loading])

  return (
    <AnimatePresence>
      {reveal && (
        <motion.div
          key='mask'
          className='fixed inset-0 z-50 bg-[#101010]'
          style={{
            WebkitMaskImage:
              'radial-gradient(circle at center, transparent 4rem, red 4rem, red 4.4rem, black 4.4rem)',
            maskImage:
              'radial-gradient(circle at center, transparent 4rem, red 4rem, red 4.4rem, black 4.4rem)',
          }}
          initial={{
            //WebkitMaskImage: 'radial-gradient(circle at center, transparent 4rem, red 4rem, red 4.4rem, black 4.4rem)',
            maskImage:
              'radial-gradient(circle at center, transparent 4rem, red 4rem, red 4.4rem, black 4.4rem)',
          }}
          animate={{
            //WebkitMaskImage: 'radial-gradient(circle at center, transparent 150%, red 150%, red 154%, black 154%)',
            maskImage:
              'radial-gradient(circle at center, transparent 150%, red 150%, red 154%, black 154%)',
          }}
          transition={revealTransition}
          onAnimationComplete={() => setReveal(false)}
        />
      )}

      {/* Nội dung site */}
      <motion.div
        initial={{ opacity: reveal ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
