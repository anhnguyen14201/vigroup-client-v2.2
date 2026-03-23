'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utils'

interface Language {
  _id: string
  code: string
  name?: string
  iconUrl?: string[]
}

interface LanguageSwitcherProps {
  languagesData: Language[]
  currentLang: string
  onLangChange: (code: string) => void
}
const LanguageSwitcher = ({
  languagesData,
  currentLang,
  onLangChange,
}: LanguageSwitcherProps) => {
  return (
    <div className='flex items-center gap-1.5 p-1'>
      {languagesData.map(l => {
        const isActive = currentLang === l.code

        return (
          <button
            key={l.code}
            type='button' // Tránh trigger submit form ngoài ý muốn
            onClick={() => onLangChange(l.code)}
            className={cn(
              'relative flex items-center cursor-pointer justify-center p-0.5 rounded-full transition-all duration-200',
              isActive
                ? 'ring-primary ring-offset-2 ring-offset-background scale-105'
                : 'hover:scale-105',
            )}
            title={l.name || l.code}
          >
            <div
              className={cn(
                'relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-muted border border-border/20',
                isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100',
              )}
            >
              {l.iconUrl?.[0] ? (
                <Image
                  src={l.iconUrl[0]}
                  alt={l.code}
                  fill
                  sizes='20px'
                  className='object-cover'
                />
              ) : (
                <span className='text-[8px] font-bold leading-none'>
                  {l.code.toUpperCase()}
                </span>
              )}
            </div>

            {isActive && (
              <span className='absolute inset-0 rounded-full border-[1.5px] border-primary pointer-events-none' />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
