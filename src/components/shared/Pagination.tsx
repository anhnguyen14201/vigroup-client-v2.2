'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const siblingCount = 1
    pages.push(1)
    const startPage = Math.max(2, currentPage - siblingCount)
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

    if (startPage > 2) pages.push('ellipsis-start')
    for (let i = startPage; i <= endPage; i++) pages.push(i)
    if (endPage < totalPages - 1) pages.push('ellipsis-end')
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const pageNumbers = getPageNumbers()

  return (
    <div
      className='max-w-7xl mx-auto w-full flex items-center 
                justify-center gap-3'
    >
      {/* Nút Previous */}
      <button
        disabled={currentPage === 1}
        onClick={handlePrev}
        className='w-10 h-10 md:w-11 md:h-11 flex items-center justify-center 
                  rounded-2xl bg-white border border-slate-200 disabled:opacity-20 
                  cursor-pointer hover:border-primary hover:text-primary transition-all 
                  active:scale-95'
      >
        <ChevronLeft size={20} />
      </button>

      {/* --- PHIÊN BẢN DESKTOP: Hiển thị dãy số (sm trở lên) --- */}
      <div className='hidden sm:flex items-center gap-2'>
        {pageNumbers.map((page, idx) => {
          if (typeof page === 'string') {
            return (
              <div
                key={page}
                className='w-10 h-10 flex items-center justify-center text-slate-400'
              >
                <MoreHorizontal size={16} />
              </div>
            )
          }
          const isActive = currentPage === page
          return (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl font-black text-sm 
                        transition-all cursor-pointer
                        ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white text-slate-500 border border-slate-200' +
                              ' hover:border-primary hover:text-primary'
                        }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* --- PHIÊN BẢN MOBILE: Hiển thị Select (Dưới sm) --- */}
      <div className='flex sm:hidden items-center'>
        <Select
          value={currentPage.toString()}
          onValueChange={val => onPageChange(Number(val))}
        >
          <SelectTrigger
            className='h-10 border-none bg-slate-50 rounded-xl px-4 
                      focus:ring-0 focus:ring-offset-0 shadow-none'
          >
            <div className='flex items-center gap-1 font-black text-sm text-slate-900'>
              <span className='text-primary'>{currentPage}</span>
              <span className='text-slate-400 font-medium'>/</span>
              <span>{totalPages}</span>
            </div>
          </SelectTrigger>
          <SelectContent className='rounded-2xl border-slate-100 min-w-20'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <SelectItem
                key={p}
                value={p.toString()}
                className='rounded-xl focus:bg-primary focus:text-white font-bold'
              >
                Trang {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nút Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className='w-10 h-10 md:w-11 md:h-11 flex items-center justify-center 
                  rounded-2xl bg-white border border-slate-200 disabled:opacity-20
                  cursor-pointer hover:border-primary hover:text-primary transition-all 
                  active:scale-95'
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export default Pagination
