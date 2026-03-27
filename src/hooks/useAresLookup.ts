import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { UseFormReturn } from 'react-hook-form'

export const useAresLookup = (form: UseFormReturn<any>) => {
  const [isFetching, setIsFetching] = useState(false)

  // Lấy giá trị ico
  const wIco = form.watch('ico')

  useEffect(() => {
    // CHẶN: Nếu không có ICO hoặc độ dài chưa đủ (ICO Séc thường là 8 số)
    // Điều này ngăn việc gọi API ngay khi vừa mở Form (lúc ico = "")
    if (!wIco || wIco.length < 8) {
      return
    }

    // DEBOUNCE: Đợi người dùng ngừng gõ 500ms rồi mới gọi API
    const delayDebounceFn = setTimeout(async () => {
      setIsFetching(true)
      try {
        const res = await fetch(
          `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${wIco}`,
        )

        if (res.ok) {
          const data = await res.json()

          // Sử dụng { shouldDirty: false } để tránh làm form bị đánh dấu là đã thay đổi bởi user
          form.setValue('companyName', data.obchodniJmeno)
          form.setValue('dic', data.dic || `CZ${wIco}`)

          const addr = data.sidlo
          const formattedAddr =
            `${addr.nazevUlice || addr.nazevObce} ${addr.cisloDomovni}${addr.cisloOrientacni ? '/' + addr.cisloOrientacni : ''}, ${addr.nazevObce} ${addr.psc || ''}`.trim()

          form.setValue('address', formattedAddr)

          toast.success('Xác thực doanh nghiệp thành công!')
        }
      } catch (err) {
        console.error('ARES Error:', err)
      } finally {
        setIsFetching(false)
      }
    }, 500) // Đợi 500ms

    return () => clearTimeout(delayDebounceFn)
  }, [wIco, form.setValue]) // Chỉ nên depend vào những thứ thực sự cần thiết

  return { isFetching }
}
