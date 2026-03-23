import { IUser } from '@/types/user.type'

export interface IAuthState {
  accessToken: string | null
  user: IUser | null

  setAccessToken: (accessToken: string) => void
  clearState: () => void
  signUp: (data: any) => Promise<void>
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  fetchMe: () => Promise<void>
  refresh: () => Promise<void>
  signInFB: (fbResponse: any) => Promise<any>
}
