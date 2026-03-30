import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/lib'
import { ROLE_MAP, ROLE_OPTIONS } from '@/constants'
import { useAresLookup } from '@/hooks'
import { useUserContext } from '../hooks/UserManagementContext'

export const useUserForm = () => {
  const { isFormOpen, setIsFormOpen, handleSave, editingUser, subTab, user } =
    useUserContext()

  const isStaff = subTab === 'staff'
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const prevEditingUserId = useRef<string | null>(null)

  const currentUserRole = String(user?.role)

  // 1. Logic lọc Role
  const filteredRoles = useMemo(() => {
    if (currentUserRole === ROLE_MAP.SUPER_ADMIN) return ROLE_OPTIONS
    if (currentUserRole === ROLE_MAP.ADMIN) {
      return ROLE_OPTIONS.filter(opt => opt.value !== ROLE_MAP.ADMIN)
    }
    if (currentUserRole === ROLE_MAP.MANAGER) {
      const lowerRoles = [
        ROLE_MAP.STAFF,
        ROLE_MAP.ACCOUNTANT,
        ROLE_MAP.SUPPLIER,
        ROLE_MAP.WEB_MANAGER,
      ]
      return ROLE_OPTIONS.filter(opt => lowerRoles.includes(opt.value))
    }
    return []
  }, [currentUserRole])

  // 2. Cấu hình Form
  const formMethods = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      role: '',
      position: '',
      hourlyRate: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      address: '',
      ico: '',
      dic: '',
      street: '',
      province: '',
      postalCode: '',
      isBlock: false,
    },
  })

  const { watch, setValue, reset, handleSubmit } = formMethods
  const watchedIco = watch('ico')
  const isBlocked = watch('isBlock')

  // 3. Logic ARES Lookup
  const { isFetching: isFetchingAres } = useAresLookup({
    ico: watchedIco,
    enabled: !editingUser && !!watchedIco && watchedIco.length >= 8,
    onSuccess: data => {
      if (data.companyName) setValue('companyName', data.companyName)
      if (data.dic) setValue('dic', data.dic)
      if (data.companyAddress) setValue('address', data.companyAddress)
    },
  })

  // 4. Logic Sync dữ liệu khi đóng/mở hoặc đổi User
  useEffect(() => {
    const currentId = editingUser
      ? editingUser.employeeId || editingUser._id
      : `new-${subTab}`

    if (prevEditingUserId.current !== currentId) {
      if (editingUser) {
        reset({
          ...editingUser,
          role: String(editingUser.role),
          password: '',
          confirmPassword: '',
        })
      } else {
        reset({
          fullName: '',
          phone: '',
          email: '',
          role: isStaff ? ROLE_MAP.STAFF : ROLE_MAP.CUSTOMER,
          position: isStaff ? 'Nhân viên' : 'Khách hàng',
          hourlyRate: '',
          password: '',
          confirmPassword: '',
          companyName: '',
          ico: '',
          dic: '',
          address: '',
          street: '',
          province: '',
          postalCode: '',
          isBlock: false,
        })
      }
      prevEditingUserId.current = currentId
    }
  }, [editingUser, reset, isStaff, subTab])

  const onSubmit = async (data: any) => {
    try {
      await handleSave(data)
      if (!editingUser) reset()
    } catch (error) {
      console.error('Lỗi khi lưu, giữ nguyên dữ liệu form.')
    }
  }

  return {
    ...formMethods,
    onSubmit: handleSubmit(onSubmit),
    isFormOpen,
    setIsFormOpen,
    editingUser,
    isStaff,
    showPass,
    setShowPass,
    showConfirmPass,
    setShowConfirmPass,
    filteredRoles,
    isFetchingAres,
    isBlocked,
  }
}
