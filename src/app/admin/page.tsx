'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
//import { LoginForm } from '@/components'
import { useAuthStore } from '@/stores'
import { AdminLoginPage } from '@/components'

export default function LoginPage() {
  return <AdminLoginPage />
}
