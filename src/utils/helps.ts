import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Video,
  Github,
  Gem,
  Heart,
  Sparkles,
  ShieldCheck,
  Star,
  Flower2,
  Zap,
  Leaf,
} from 'lucide-react'

export const getInitialMode = () => {
  if (typeof window === 'undefined') return 'employees'
  try {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('mode')
    if (q === 'employees' || q === 'customers') return q
    const ls = localStorage.getItem('mode')
    if (ls === 'employees' || ls === 'customers') return ls
  } catch (e) {}
  return 'employees'
}

export const parseServerError = (e: any) => {
  if (e?.response?.data) {
    const d = e.response.data
    if (typeof d === 'string') return d
    if (d.message) return d.message
    if (d.errors) {
      if (Array.isArray(d.errors))
        return d.errors.map((it: any) => it.msg || it).join(', ')
      if (typeof d.errors === 'object')
        return Object.values(d.errors).flat().join(', ')
    }
  }
  if (e?.data?.message) return e.data.message
  if (e?.message) return e.message
  return 'Đã xảy ra lỗi. Vui lòng thử lại.'
}

export const initials = (s?: string) => {
  if (!s) return '?'
  const parts = s.trim().split(/\s+/)
  return (
    parts[0]?.[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')
  ).toUpperCase()
}

export const getPlatformStyle = (type: string) => {
  const t = type.toLowerCase()
  switch (t) {
    case 'facebook':
      return {
        icon: Facebook,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        label: 'Facebook',
      }
    case 'instagram':
      return {
        icon: Instagram,
        color: 'text-pink-600',
        bg: 'bg-pink-50 border-pink-200',
        label: 'Instagram',
      }
    case 'youtube':
      return {
        icon: Youtube,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        label: 'YouTube',
      }
    case 'tiktok':
      return {
        icon: Video,
        color: 'text-black',
        bg: 'bg-gray-100 border-gray-200',
        label: 'TikTok',
      }
    case 'twitter':
    case 'x':
      return {
        icon: Twitter,
        color: 'text-sky-500',
        bg: 'bg-sky-50 border-sky-200',
        label: 'Twitter / X',
      }
    case 'linkedin':
      return {
        icon: Linkedin,
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        label: 'LinkedIn',
      }
    case 'github':
      return {
        icon: Github,
        color: 'text-gray-800',
        bg: 'bg-gray-100 border-gray-200',
        label: 'Github',
      }
    default:
      return {
        icon: Globe,
        color: 'text-slate-600',
        bg: 'bg-slate-50 border-slate-200',
        label: type || 'Website',
      }
  }
}

export const getPhilosophyMeta = (index: number) => {
  const meta = [
    { icon: Gem, color: 'hover:bg-primary' },
    { icon: Heart, color: 'hover:bg-primary' },
    { icon: Sparkles, color: 'hover:bg-primary' },
    { icon: ShieldCheck, color: 'hover:bg-primary' },
    { icon: Star, color: 'hover:bg-primary' },
    { icon: Leaf, color: 'hover:bg-primary' },
    { icon: Zap, color: 'hover:bg-primary' },
    { icon: Flower2, color: 'hover:bg-primary' },
  ]

  // Trả về icon và màu sắc tương ứng, nếu hết mảng thì quay lại từ đầu
  return meta[index % meta.length]
}

export const idOf = (x: any) => {
  if (!x && x !== 0) return null
  if (typeof x === 'string') return x
  if (typeof x === 'object') return x._id ?? (x.toString ? x.toString() : null)
  return String(x)
}

export const roleMap: Record<
  string,
  {
    label: string
    variant: 'destructive' | 'default' | 'outline' | 'secondary'
    className: string
  }
> = {
  dGES29X3r5: {
    label: 'Admin',
    variant: 'destructive',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  goI6WUAy2L: {
    label: 'Quản lý',
    variant: 'default',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  is98ZpYyeJ: {
    label: 'Nhân viên',
    variant: 'secondary',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
}

export const statusBooking: any = {
  pending: {
    label: 'Chờ duyệt',
    cls: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  confirmed: {
    label: 'Đã xác nhận',
    cls: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  complete: {
    label: 'Đã đến',
    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  no_show: {
    label: 'Không đến',
    cls: 'bg-slate-100 text-slate-600 ring-slate-300',
  },
  cancel: { label: 'Đã hủy', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

export const getVisiblePages = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]

  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]

  return [1, '...', current - 1, current, current + 1, '...', total]
}
