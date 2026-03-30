import { useMemo } from 'react'

export const useProjectFinance = (project: any) => {
  return useMemo(() => {
    const totalAmount = project?.totalAmount || 0
    const totalQuotation = project?.totalQuotationAmount || 0
    const totalVariation = project?.totalVariationAmount || 0
    const totalReceived = project?.totalReceived || 0
    const depositAmount = project?.deposit?.amount || 0

    // Tính toán số tiền còn lại
    const remaining =
      totalAmount > 0 ? Math.max(0, totalAmount - totalReceived) : 0

    // Tính % tiến độ thu tiền
    const progressPercent =
      totalAmount > 0
        ? Math.min(100, Math.round((totalReceived / totalAmount) * 100))
        : 0

    return {
      totalAmount,
      totalQuotation,
      totalVariation,
      totalReceived,
      depositAmount,
      remaining,
      progressPercent,
      // Thêm flag để UI xử lý nhanh
      isFullyPaid: totalReceived >= totalAmount && totalAmount > 0,
      hasDeposit: depositAmount > 0,
    }
  }, [project])
}
