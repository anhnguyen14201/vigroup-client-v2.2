// hooks/useAuth.ts
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores'
import { toast } from 'sonner'
import nProgress from 'nprogress'

export const useAuth = () => {
  const router = useRouter()
  const { user, signOut } = useAuthStore() as any

  const handleLogout = async () => {
    nProgress.start()
    try {
      await signOut()
      toast.success('Đã đăng xuất thành công')
      router.replace('/admin') // Hoặc trang login của bạn
    } catch (error) {
      toast.error('Có lỗi khi đăng xuất')
    } finally {
      nProgress.done()
    }
  }

  return {
    user,
    isLoggedIn: !!user,
    handleLogout,
    userRole: user?.role,
  }
}
