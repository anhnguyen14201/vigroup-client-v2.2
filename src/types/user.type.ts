import { ID } from '@/types/commons.type'

export interface IUser {
  id: ID
  _id?: ID
  fullName: string
  branchId?: string
  username?: string
  email?: string
  phone?: any
  baseSalary?: number | string
  role?: string
  password?: string
  confirmPassword?: string
  commissionPercent?: number | string
  accumulatedPoints?: number | string
  active: boolean
  address?: string
}
