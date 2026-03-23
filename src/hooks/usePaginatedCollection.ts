// hooks/usePaginatedCollection.ts
import useSWR from 'swr'

export function usePaginatedCollection<T, F = any>(
  key: string | null, // Cho phép truyền null để tạm dừng fetch
  filters: F,
  fetcher: (args: {
    pageIndex?: number
    pageSize?: number | 'all'
    filters: F
  }) => Promise<any>,
  pageIndex: number = 1,
  pageSize: number | 'all' = 8,
) {
  // 1. Tối ưu Key: Nếu là 'all' thì không cần quan tâm đến pageIndex để tận dụng Cache
  const swrKey = key
    ? [
        key,
        pageSize === 'all' ? 'all' : pageIndex,
        pageSize,
        JSON.stringify(filters),
      ]
    : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    swrKey,
    // Khi pageSize là 'all', ta truyền thẳng để fetcher xử lý logic không limit
    () =>
      fetcher({
        pageIndex: pageSize === 'all' ? undefined : pageIndex,
        pageSize,
        filters,
      }),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  )

  return {
    // Data chính
    items: data?.data ?? [],

    // Metadata cho phân trang
    totalItems: data?.pagination?.total ?? 0,
    totalPages: data?.pagination?.totalPages ?? 0,

    // Các trường mở rộng cho báo cáo/thống kê (ANGEN POS specific)
    totalAmount: data?.totalAmount ?? 0,
    totalTip: data?.totalTip ?? 0,
    soldVoucherTotal: data?.soldVoucherTotal ?? 0,
    soldVoucherCount: data?.soldVoucherCount ?? 0,
    discountVoucherTotal: data?.discountVoucherTotal ?? 0,

    // States
    isLoading,
    isRefreshing: isValidating, // Đang cập nhật dữ liệu ngầm
    error,
    mutate,
  }
}
