// File: components/CartSidebar/_helpers.ts
export const validateVoucher = (v: any, activeCustomer?: any) => {
  if (!v) return { ok: false, status: 'invalid', message: 'Voucher không hợp lệ' }

  if (v.disabled === true) return { ok: false, status: 'disabled', message: 'Voucher đã bị vô hiệu' }

  const now = new Date()

  if (v.startDate) {
    const s = new Date(v.startDate)
    if (!isNaN(s.getTime()) && s > now)
      return { ok: false, status: 'not_started', message: 'Voucher chưa bắt đầu áp dụng' }
  }
  if (v.endDate) {
    const e = new Date(v.endDate)
    if (!isNaN(e.getTime()) && e < now) return { ok: false, status: 'expired', message: 'Voucher đã hết hạn' }
  }

  if (v.remainingAmount !== undefined && v.remainingAmount !== null) {
    if (Number(v.remainingAmount) <= 0) return { ok: false, status: 'no_balance', message: 'Voucher đã hết tiền' }
  } else if (v.balance !== undefined && v.balance !== null) {
    if (Number(v.balance) <= 0) return { ok: false, status: 'no_balance', message: 'Voucher đã hết tiền' }
  }

  if (v.usesLeft !== undefined && v.usesLeft !== null) {
    if (Number(v.usesLeft) <= 0) return { ok: false, status: 'no_uses', message: 'Voucher đã hết lượt sử dụng' }
  }

  if (v.customerId || v.customer) {
    const vid = String(v.customerId ?? v.customer?.id ?? v.customer?._id ?? '')
    const cid = activeCustomer?.id ?? ''
    if (vid && cid && String(vid) !== String(cid)) {
      return { ok: false, status: 'not_for_customer', message: 'Voucher không áp dụng cho khách này' }
    }
  }

  if (!v.code && !v._id) return { ok: false, status: 'invalid', message: 'Voucher không hợp lệ' }

  return { ok: true, status: 'active', message: 'Voucher hợp lệ' }
}

export const voucherStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return { text: 'Hợp lệ', tone: 'success' }
    case 'expired':
      return { text: 'Hết hạn', tone: 'danger' }
    case 'not_started':
      return { text: 'Chưa bắt đầu', tone: 'warning' }
    case 'empty':
      return { text: 'Hết tiền', tone: 'danger' }
    case 'no_uses':
      return { text: 'Hết lượt', tone: 'danger' }
    case 'disabled':
      return { text: 'Bị vô hiệu', tone: 'danger' }
    case 'not_for_customer':
      return { text: 'Không áp dụng', tone: 'warning' }
    default:
      return { text: 'Không hợp lệ', tone: 'danger' }
  }
}
