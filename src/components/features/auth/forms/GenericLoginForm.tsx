'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

import LogoImage from '@/app/assets/logo/logo_dark.png'

import { useAuthStore } from '@/stores'
import { useLoadingStore } from '@/stores/loadingStore'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import { ADMIN_ACCESS_ROLES, EMPLOYEE_ACCESS_ROLES } from '@/constants'

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập Email hoặc Số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

// Định nghĩa props để tái sử dụng
interface GenericLoginFormProps {
  title?: string
}

export default function ({
  title = 'Đăng nhập hệ thống',
}: GenericLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const signIn = useAuthStore((state: any) => state.signIn)
  const loading = useLoadingStore((state: any) => state.loading)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const toastId = toast.loading('Đang xác thực thông tin...')

    try {
      await signIn(values.username, values.password)
      const user = useAuthStore.getState()?.user as any
      const currentPath = window.location.pathname

      if (!user) throw new Error('Không tìm thấy thông tin người dùng')

      let destination = ''

      // Kiểm tra quyền dựa trên file constants đã tách
      if (currentPath.includes('/admin')) {
        if (ADMIN_ACCESS_ROLES.includes(user.role)) {
          destination = '/admin/dashboard'
        } else {
          throw new Error('Bạn không có quyền truy cập Quản trị')
        }
      } else {
        if (EMPLOYEE_ACCESS_ROLES.includes(user.role)) {
          destination = '/dashboard'
        } else {
          throw new Error('Tài khoản không có quyền truy cập khu vực này')
        }
      }

      toast.success(`Chào mừng, ${user.fullName}!`, { id: toastId })
      router.push(destination)
    } catch (error: any) {
      toast.error(error?.message || 'Đăng nhập thất bại', { id: toastId })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <Card className='w-full max-w-md pb-10 border-t-4 border-t-primary'>
        <CardHeader className='space-y-1 text-center flex flex-col items-center'>
          <div className='w-full max-w-50 mt-10 mb-5 flex items-center justify-center'>
            <Image
              src={LogoImage}
              alt='Logo Angen'
              width={500} // Để giá trị lớn để chất lượng tốt
              height={200} // Tỉ lệ hình chữ nhật
              priority
              className='w-full h-auto object-contain'
            />
          </div>
          <h2 className='text-xl font-bold text-slate-800'>{title}</h2>
          <p className='text-sm text-muted-foreground'>
            Vui lòng điền thông tin tài khoản của bạn
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-slate-700 font-medium'>
                      Tài khoản
                    </FormLabel>
                    <FormControl>
                      <div className='relative flex items-center'>
                        <User
                          className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
                                    text-slate-400'
                        />
                        <Input
                          placeholder='Email hoặc số điện thoại'
                          className='pl-10 h-11 rounded-full'
                          disabled={loading}
                          {...field}
                          onFocus={e => e.target.select()}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-slate-700 font-medium'>
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <div className='relative flex items-center'>
                        <Lock
                          className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 
                                    text-slate-400'
                        />
                        <Input
                          placeholder='••••••••'
                          type={showPassword ? 'text' : 'password'}
                          className='pl-10 h-11 rounded-full'
                          disabled={loading}
                          {...field}
                          onFocus={e => e.target.select()}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 top-1/2 -translate-y-1/2 
                                    text-slate-400 hover:text-primary'
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full font-bold h-11 rounded-full cursor-pointer'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang xác thực...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
