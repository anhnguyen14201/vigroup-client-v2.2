'use client'

import { useEffect, useRef, useState } from 'react'

type AresLookupResult = {
  companyName?: string
  dic?: string
  companyAddress?: string
}

type UseAresLookupParams = {
  ico?: string
  enabled?: boolean
  onSuccess: (data: AresLookupResult) => void
}

export const useAresLookup = ({
  ico,
  enabled = true,
  onSuccess,
}: UseAresLookupParams) => {
  const [isFetching, setIsFetching] = useState(false)
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    const normalizedIco = (ico || '').trim()
    if (!enabled || normalizedIco.length < 8) return

    const delayDebounceFn = setTimeout(async () => {
      setIsFetching(true)
      try {
        const res = await fetch(
          `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${normalizedIco}`,
        )
        if (!res.ok) return

        const data = await res.json()
        const sidlo = data.sidlo || {}
        const formattedAddress =
          `${sidlo.nazevUlice || sidlo.nazevObce || ''} ${sidlo.cisloDomovni || ''}${sidlo.cisloOrientacni ? '/' + sidlo.cisloOrientacni : ''}, ${sidlo.nazevObce || ''} ${sidlo.psc || ''}`.trim()

        // Gọi qua Ref thay vì gọi trực tiếp onSuccess từ props
        onSuccessRef.current({
          companyName: data.obchodniJmeno || '',
          dic: data.dic || `CZ${normalizedIco}`,
          companyAddress: formattedAddress,
        })
      } catch (err) {
        console.error('ARES Error:', err)
      } finally {
        setIsFetching(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [ico, enabled]) // BỎ onSuccess khỏi đây

  return { isFetching }
}
