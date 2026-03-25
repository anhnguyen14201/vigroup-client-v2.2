export const getPaymentStatus = (status: string) => {
  const map = {
    unpaid: {
      label: 'Chưa thanh toán',
      color: 'bg-rose-500/10 text-rose-600 border-rose-200',
    },
    deposited: {
      label: 'Đã đặt cọc',
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-200',
    },
    partial: {
      label: 'Thanh toán một phần',
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-200',
    },
    paid: {
      label: 'Đã thanh toán',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-200',
    },
    processing: {
      label: 'Chờ xử lý',
      color: 'bg-amber-500/10 text-amber-500 border-amber-200',
    },
  }
  return map[status as keyof typeof map] || map.unpaid
}

// 2. Logic Trạng thái vận hành (XUỐNG DƯỚI)
export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'processing':
      return {
        label: 'Chờ xử lý',
        style: 'bg-amber-500/10 text-amber-600 border-amber-200',
      }
    case 'started':
      return {
        label: 'Đang thi công',
        style: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      }
    case 'finished':
      return {
        label: 'Hoàn thành',
        style: 'bg-sky-500/10 text-sky-600 border-sky-200',
      }
    case 'cancelled':
      return {
        label: 'Đã hủy',
        style: 'bg-rose-500/10 text-rose-600 border-rose-200',
      }
    default:
      return {
        label: 'N/A',
        style: 'bg-slate-100 text-slate-500 border-slate-200',
      }
  }
}
