// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Hàm cn có sẵn của shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Thêm hàm của bạn vào đây
export const getInitials = (name: string): string => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()

  const firstInitial = parts[0].charAt(0)
  const lastInitial = parts[parts.length - 1].charAt(0)
  return (firstInitial + lastInitial).toUpperCase()
}

export const getRoleDetails = (role: number) => {
  const r = role // Chuyển về In hoa để khớp với dữ liệu backend
  // Nhóm Quyền cao nhất (Màu Đỏ - Primary)
  if ([3515, 23521311920518].includes(r)) {
    return {
      label: r === 3515 ? 'SUPER' : 'Quản trị viên',
      color: 'bg-red-50 text-[#c74242] border-red-200', // Dùng mã đỏ chủ đạo của bạn
    }
  }

  // Nhóm Quản trị (Màu Đỏ nhạt hoặc Cam)
  if ([1413914].includes(r)) {
    return {
      label: 'Admin',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    }
  }

  // Nhóm Quản lý (Màu Xanh dương)
  if ([1311417518].includes(r)) {
    return {
      label: 'Quản trị hệ thống',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    }
  }

  // Các role khác (Nhân viên, Thư ký, Người mua...)
  if ([5131612152555, 19531852011825, 22125518].includes(r)) {
    const labels: Record<string, string> = {
      EMPLOYEE: 'Nhân viên',
      SECRETARY: 'Thư ký',
      BUYER: 'Thu mua',
    }
    return {
      label: labels[r] || 'Thành viên',
      color: 'bg-green-50 text-green-600 border-green-200',
    }
  }

  // Mặc định
  return {
    label: 'Khách hàng',
    color: 'bg-gray-50 text-gray-500 border-gray-200',
  }
}
