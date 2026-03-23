'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores'
import { useLoadingStore } from '@/stores/loadingStore'

interface AuthProviderProps {
  children: React.ReactNode
  allowedRoles?: string[]
  page?: string
}

const AuthProvider = ({ children, allowedRoles, page }: AuthProviderProps) => {
  const router = useRouter()
  const { accessToken, user, refresh, fetchMe } = useAuthStore()
  const { loading } = useLoadingStore()
  const [isAuthorizing, setIsAuthorizing] = useState(true)

  // 1. Xử lý logic khởi tạo (Refresh token / Fetch User)
  useEffect(() => {
    const init = async () => {
      try {
        if (!accessToken) await refresh()
        if (accessToken && !user) await fetchMe()
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setIsAuthorizing(false)
      }
    }
    init()
  }, [accessToken, user, refresh, fetchMe])

  // 2. Xử lý ĐIỀU HƯỚNG trong useEffect để tránh lỗi "Cannot update during render"
  useEffect(() => {
    // Nếu đã kiểm tra xong (isAuthorizing = false) và không bận loading
    if (!isAuthorizing && !loading) {
      // Kiểm tra đăng nhập
      if (!accessToken || !user) {
        router.replace(`/${page}`)
        return
      }

      // Kiểm tra phân quyền
      if (allowedRoles && allowedRoles.length > 0) {
        const userRole =
          typeof user?.role === 'object' ? (user.role as any)._id : user?.role
        if (!userRole || !allowedRoles.includes(userRole)) {
          router.replace('/')
        }
      }
    }
  }, [isAuthorizing, loading, accessToken, user, allowedRoles, router])

  // 3. Render: Trong khi đang kiểm tra hoặc chưa đủ điều kiện, trả về null (tránh render con)
  if (isAuthorizing || loading || !accessToken || !user) {
    return null
  }

  // Kiểm tra vai trò thêm một lần ở render (để đảm bảo không leak UI trước khi redirect)
  const userRole =
    typeof user?.role === 'object' ? (user.role as any)._id : user?.role
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!userRole || !allowedRoles.includes(userRole))
  ) {
    return null
  }

  return <>{children}</>
}

export default AuthProvider
