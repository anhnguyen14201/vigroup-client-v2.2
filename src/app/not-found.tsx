'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion' // Thêm motion

import imageNotFound from './assets/images/original-743c2e1ea63d2ae97d9286d0cab9be6b.gif'
import { Home } from 'lucide-react'

export default function LocaleNotFound() {
  const { locale } = useParams()
  const router = useRouter()
  const t = useTranslations('notfound')

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Header bar giả hoặc khoảng trống phía trên */}
      <div className='bg-black h-16 w-full'></div>

      <main className='flex-1 flex justify-center items-center flex-col px-6 py-12'>
        {/* Container cho Image với hiệu ứng Float (bay nhẹ) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='relative w-full max-w-150 aspect-square'
        >
          <Image
            src={imageNotFound.src}
            alt='404 Illustration'
            fill
            className='object-contain'
            priority
            sizes='(max-width: 768px) 100vw, 600px'
          />
        </motion.div>

        {/* Phần nội dung chữ với hiệu ứng xuất hiện trễ (Stagger) */}
        <motion.div
          className='text-center space-y-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className='text-lg sm:text-xl text-gray-500 max-w-md mx-auto'>
            {t('Pagenotfound') ||
              'Oops! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.'}
          </p>

          {/* Nút bấm với hiệu ứng Hover/Tap */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-6'>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 10px 25px rgba(199, 66, 66, 0.3)', // Đổ bóng nhẹ khi hover
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/${locale}`)}
              className='group relative flex items-center gap-2 px-10 py-3.5 rounded-full 
                        bg-linear-to-r from-[#C74242] to-[#E05A5A] 
                        text-white font-bold tracking-wide cursor-pointer
                        overflow-hidden transition-all duration-300 ease-out'
            >
              {/* Hiệu ứng Shine (ánh sáng lướt qua khi hover) */}
              <span
                className='absolute inset-0 w-full h-full bg-linear-to-r from-transparent 
                          via-white/20 to-transparent -translate-x-full 
                          group-hover:animate-[shimmer_1.5s_infinite] transition-transform'
              />

              <Home size={20} />

              <span className='relative'>{t('Returntohomepage')}</span>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
