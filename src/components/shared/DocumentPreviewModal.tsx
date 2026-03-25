'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface DocumentPreviewModalProps {
  files: string[]
  initialIndex?: number
  onClose: () => void
}

const DocumentPreviewModal = ({
  files,
  initialIndex = 0,
  onClose,
}: DocumentPreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (files.length > 0) {
      setCurrentIndex(initialIndex)
      // Ngăn scroll body khi mở modal
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [initialIndex, files])

  if (!files || files.length === 0) return null

  const currentUrl = files[currentIndex]
  const isPdf = currentUrl?.toLowerCase().endsWith('.pdf')

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex(prev => (prev + 1) % files.length)
  }

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex(prev => (prev - 1 + files.length) % files.length)
  }

  return (
    <AnimatePresence>
      {files.length > 0 && (
        <div className='fixed inset-0 z-200 flex items-center justify-center p-4 md:p-10'>
          {/* Backdrop mượt mà giống AddQuoteModal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className='relative bg-[#0a0a0a] w-full h-full max-w-[65vw] max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col'
          >
            {/* Header: Design đồng nhất */}
            <div className='p-4 md:p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0'>
              <div className='flex items-center gap-4 ml-2'>
                <div className='w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/70 border border-white/10'>
                  {isPdf ? <FileText size={20} /> : <ImageIcon size={20} />}
                </div>
                <div>
                  <p className='text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5'>
                    Preview Document
                  </p>
                  <p className='text-sm font-bold text-white uppercase'>
                    Hóa đơn ({currentIndex + 1} / {files.length})
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <a
                  href={currentUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='hidden md:flex px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full text-[10px] font-black transition-all items-center gap-2 border border-white/10'
                >
                  MỞ TAB MỚI <ExternalLink size={14} />
                </a>

                <button
                  onClick={onClose}
                  className='w-10 h-10 bg-white/5 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all border border-white/10 group'
                >
                  <X
                    size={20}
                    className='group-hover:rotate-90 transition-transform'
                  />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className='flex-1 w-full bg-[#050505] relative overflow-hidden flex items-center justify-center group'>
              {/* Navigation Arrows */}
              {files.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className='absolute left-6 z-[60] p-4 rounded-full bg-black/50 text-white border border-white/10 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 hidden md:block'
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className='absolute right-6 z-[60] p-4 rounded-full bg-black/50 text-white border border-white/10 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 hidden md:block'
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Media Display */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentUrl}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className='w-full h-full flex items-center justify-center'
                >
                  {isPdf ? (
                    <div className='w-full h-full bg-[#1a1a1a]'>
                      <iframe
                        src={`${currentUrl}#view=FitH`}
                        className='w-full h-full border-none'
                        title='PDF Viewer'
                      />
                    </div>
                  ) : (
                    <div className='w-full h-full p-6 flex items-center justify-center bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] overflow-auto'>
                      <img
                        src={currentUrl}
                        className='max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg'
                        alt={`Preview ${currentIndex}`}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Mobile Navigation Taps (Optional) */}
              <div className='absolute bottom-6 flex md:hidden gap-4'>
                <button
                  onClick={prevSlide}
                  className='p-3 bg-white/10 rounded-full text-white'
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className='p-3 bg-white/10 rounded-full text-white'
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DocumentPreviewModal
