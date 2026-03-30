import { cn } from '@/lib/utils'

export type QuoteType = 'quotation' | 'extra'

/**
 * Trả về class màu sắc dựa trên trạng thái của Quote Modal
 */
export const getQuoteTheme = (isEdit: boolean, type: QuoteType) => {
  // Định nghĩa màu chủ đạo
  const theme = isEdit
    ? { base: 'bg-blue-600', hover: 'hover:bg-blue-700' }
    : type === 'quotation'
      ? { base: 'bg-sky-600', hover: 'hover:bg-sky-700' }
      : { base: 'bg-emerald-600', hover: 'hover:bg-emerald-700' }

  return {
    header: cn('p-6 text-white transition-colors duration-300', theme.base),
    submitBtn: cn(
      'flex-1 rounded-full h-12 font-bold text-white transition-all active:scale-95',
      theme.base,
      theme.hover,
    ),
    // Bạn có thể thêm các thành phần khác vào đây nếu cần (ví dụ: border, text color)
    accent: theme.base,
  }
}


// 1. Khai báo các config hiển thị (Nên để ngoài component để tránh render lại)
export const statusLabels: Record<string, string> = {
  all: 'Tất cả tiến độ',
  processing: 'Chờ xử lý',
  started: 'Đã bắt đầu',
  finished: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

export const statusStyles: Record<string, string> = {
  processing: 'text-amber-600 border-amber-200 bg-amber-50/50',
  started: 'text-blue-600 border-blue-200 bg-blue-50/50',
  finished: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
  cancelled: 'text-rose-600 border-rose-200 bg-rose-50/50',
}

export const paymentLabels: Record<string, string> = {
  all: 'Tất cả thanh toán',
  unpaid: 'Chưa thanh toán',
  deposited: 'Đã đặt cọc',
  partial: 'Thanh toán một phần',
  paid: 'Đã thanh toán',
  processing: 'Chờ xử lý',
}

export const paymentStyles: Record<string, string> = {
  unpaid: 'text-rose-600 border-rose-200 bg-rose-50/50',
  deposited: 'text-amber-500 border-amber-200 bg-amber-50/50',
  partial: 'text-indigo-500 border-indigo-200 bg-indigo-50/50',
  paid: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
}