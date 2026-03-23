'use client'

import Image from 'next/image'
import LogoImage from '../app/assets/logo/icon_logo.png'
import { useEffect, useState } from 'react'
import { useLoadingStore } from '@/stores/loadingStore'

const InitialLoader = ({ children }: any) => {
  const [showContent, setShowContent] = useState(false)
  const { loading } = useLoadingStore()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (loading) {
      setShowContent(false)
    } else {
      timer = setTimeout(() => {
        setShowContent(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    }
    return () => clearTimeout(timer)
  }, [loading])

  if (!showContent) {
    return (
      <div
        className='fixed inset-0 z-100 flex items-center justify-center 
                  backdrop-blur-sm bg-[#101010]'
      >
        {/* Container chính: Đặt kích thước cố định bằng px để không bị nhảy trên mobile */}
        <div className='relative w-45 h-45 flex items-center justify-center'>
          {/* Spinner: Xoay quanh logo */}
          <div
            className='absolute inset-0 rounded-full border-t-4 border-b-4 
                      border-primary animate-spin'
          ></div>

          {/* Logo: Căn giữa tuyệt đối trong vòng tròn */}
          <div className='flex items-center justify-center p-4'>
            <Image
              src={LogoImage}
              alt='Logo'
              // Tăng width/height để Next.js tối ưu ảnh, nhưng dùng CSS để khống chế
              width={120}
              height={60}
              priority
              className='w-auto h-auto max-w-27.5 max-h-27.5 object-contain'
            />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default InitialLoader
