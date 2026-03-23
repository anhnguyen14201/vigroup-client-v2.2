import { useLoadingStore } from '@/stores/loadingStore'
import nProgress from 'nprogress'

// Helper để wrap logic với loading
export const withLoading = async (fn: () => Promise<void>) => {
  const { setLoading } = useLoadingStore.getState()
  setLoading(true)
  nProgress.start()

  try {
    await fn()
  } finally {
    nProgress.done()
    setLoading(false)
  }
}
