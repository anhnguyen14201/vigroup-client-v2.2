import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { useLoadingStore } from '@/stores/loadingStore'
import { withLoading } from '@/utils'
import { IAuthState } from '@/types'
import { authService, userService } from '@/services'

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,

      setAccessToken: (accessToken: string | null) => set({ accessToken }),

      clearState: () => {
        set({ accessToken: null, user: null })
        useLoadingStore.getState().setLoading(false)
      },

      signUp: async (data: any) => {
        try {
          const response = await authService.signUp(data)
          //nProgress.start()
          return response
        } catch (error) {
          console.error(error)
          throw error
        } finally {
          //nProgress.done()
        }
      },

      signIn: async (username: string, password: string) =>
        withLoading(async () => {
          try {
            const response = await authService.signIn(username, password)
            set({ accessToken: response.accessToken })
            await get().fetchMe()
          } catch (error) {
            console.error(error)
            throw error
          }
        }),

      signOut: async () =>
        withLoading(async () => {
          try {
            await authService.signOut()
            get().clearState()
          } catch (error) {
            console.error(error)
            get().clearState()
          }
        }),

      fetchMe: async () => {
        try {
          const response = await userService.fetchMe()
          set({ user: response.data })
        } catch (error) {
          console.error(error)
          get().clearState()
          throw error
        }
      },

      refresh: async () => {
        try {
          const newAccessToken = await authService.refresh()
          set({ accessToken: newAccessToken })
        } catch {
          get().clearState()
        }
      },

      signInFB: async (fbResponse: any) => {
        // BẮT BUỘC phải có return ở đây để trả kết quả về cho Component
        return await withLoading(async () => {
          try {
            const response = await authService.loginFB(fbResponse)
            set({ accessToken: response.accessToken })
            await get().fetchMe()

            // BẮT BUỘC trả về response sau khi fetchMe xong
            return response
          } catch (error) {
            console.error(error)
            throw error
          }
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
)
