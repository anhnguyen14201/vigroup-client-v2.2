import { ILoadingState } from '@/types'
import { create } from 'zustand'

export const useLoadingStore = create<ILoadingState>(set => ({
  loading: false,
  setLoading: val => set({ loading: val }),
}))
