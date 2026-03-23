import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useQueryState = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQuery = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })

    router.replace(`${pathname}?${newParams.toString()}`)
  }

  return { searchParams, setQuery }
}
