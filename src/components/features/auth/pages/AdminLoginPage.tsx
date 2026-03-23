'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GenericLoginForm from '@/components/features/auth/forms/GenericLoginForm'
import { useAuthStore } from '@/stores'
import { ADMIN_ACCESS_ROLES } from '@/constants/roles'

const AdminLoginPage = () => {
  const router = useRouter()
  const { accessToken, user } = useAuthStore() as any

  // Trạng thái để tránh bị "giật" giao diện (Hydration)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 1. Nếu đã có Token (Đã đăng nhập)
    if (accessToken && user) {
      const isAdmin = ADMIN_ACCESS_ROLES.includes(user.role)

      if (isAdmin) {
        // Đúng role Admin -> Vào thẳng dashboard
        router.replace('/admin/dashboard')
        return
      }

      // Nếu có token nhưng KHÔNG phải Admin role
      // Ở lại trang này để hiện form (hoặc bạn có thể tự động logout tại đây)
      setIsReady(true)
    } else {
      // 2. Chưa đăng nhập -> Hiện form bình thường
      setIsReady(true)
    }
  }, [accessToken, user, router])

  // Loader nhẹ trong lúc kiểm tra quyền
  if (!isReady) {
    return (
      <div className='min-h-screen bg-[#101010] flex items-center justify-center'>
        <div className='animate-pulse text-primary text-sm font-medium'></div>
      </div>
    )
  }

  return (
    <main className='min-h-screen'>
      <GenericLoginForm />
    </main>
  )
}

export default AdminLoginPage
