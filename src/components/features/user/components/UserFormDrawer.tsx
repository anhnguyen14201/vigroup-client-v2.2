'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  User,
  Phone,
  Mail,
  Briefcase,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Clock,
  CircleAlert,
  Building2,
  Hash,
  Fingerprint,
  ShieldAlert,
  MapPin,
  Loader2,
} from 'lucide-react'

import { userSchema } from '@/lib'
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
} from '@/components/ui'
import { DrawerFooter, ErrorMessage } from '@/components/shared'
import { useUserContext } from '../hooks/UserManagementContext'
import { useAresLookup } from '@/hooks'

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

const containerVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
}

const ROLE_MAP = {
  SUPER_ADMIN: '3515',
  ADMIN: '1413914',
  MANAGER: '1311417518',
  STAFF: '5131612152555',
  ACCOUNTANT: '19531852011825',
  SUPPLIER: '22125518',
  WEB_MANAGER: '23521311920518',
  CUSTOMER: '32119201513518',
}

const ROLE_OPTIONS = [
  { value: ROLE_MAP.ADMIN, label: 'Admin' },
  { value: ROLE_MAP.MANAGER, label: 'Quản lý hệ thống' },
  { value: ROLE_MAP.ACCOUNTANT, label: 'Kế toán' },
  { value: ROLE_MAP.SUPPLIER, label: 'Nhân viên - Vật tư' },
  { value: ROLE_MAP.WEB_MANAGER, label: 'Quản trị viên' },
  { value: ROLE_MAP.STAFF, label: 'Nhân viên' },
]

const UserFormDrawer = () => {
  const { isFormOpen, setIsFormOpen, handleSave, editingUser, subTab, user } =
    useUserContext()
  const isStaff = subTab === 'staff'
  const [showPass, setShowPass] = React.useState(false)
  const [showConfirmPass, setShowConfirmPass] = React.useState(false)
  const prevEditingUserId = useRef<string | null>(null)

  const currentUserRole = String(user?.role)

  // Lọc Role hiển thị trong Select dựa trên cấp bậc người đang đăng nhập
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

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onChange', // Quan trọng: Validate ngay khi nhập
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
      street: '', // Thêm mới
      province: '', // Thêm mới
      postalCode: '', // Thêm mới
      isBlock: false,
    },
  })

  const watchedIco = watch('ico')

  const { isFetching } = useAresLookup({
    ico: watchedIco,
    // Chỉ cho phép lookup khi không phải đang edit user cũ (hoặc tùy anh quyết định)
    enabled: !editingUser,
    onSuccess: data => {
      // Cập nhật các field vào react-hook-form
      if (data.companyName) setValue('companyName', data.companyName)
      if (data.dic) setValue('dic', data.dic)
      if (data.companyAddress) setValue('address', data.companyAddress)

      // Nếu anh muốn bóc tách thêm street, province từ data thô,
      // anh có thể cập nhật thêm ở hook hoặc xử lý ở đây.
    },
  })
  const isBlocked = watch('isBlock')

  // Cập nhật form khi mở Drawer hoặc đổi User cần sửa
  useEffect(() => {
    const currentId = editingUser
      ? editingUser.employeeId || editingUser._id
      : `new-${subTab}`
    if (prevEditingUserId.current !== currentId) {
      if (editingUser) {
        reset({
          fullName: editingUser.fullName || '',
          phone: editingUser.phone || '',
          email: editingUser.email || '',
          role: String(editingUser.role) || '',
          position: editingUser.position || '',
          hourlyRate: editingUser.hourlyRate || '',
          password: '',
          confirmPassword: '',
          companyName: editingUser.companyName || '',
          ico: editingUser.ico || '',
          dic: editingUser.dic || '',
          address: editingUser.address || '',
          street: editingUser.street || '', // Thêm mới
          province: editingUser.province || '', // Thêm mới
          postalCode: editingUser.postalCode || '', // Thêm mới
          isBlock: editingUser.isBlock,
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
          street: '', // Thêm mới
          province: '', // Thêm mới
          postalCode: '', // Thêm mới
          isBlock: false,
        })
      }
      prevEditingUserId.current = currentId
    }
  }, [editingUser, reset, isStaff, subTab])

  const onSubmit = async (data: any) => {
    try {
      // Chờ handleSave chạy xong, nếu có lỗi nó sẽ nhảy thẳng xuống catch
      await handleSave(data)

      // Nếu chạy đến đây tức là thành công
      if (!editingUser) {
        reset()
      }
    } catch (error) {
      // Khi có lỗi, code dừng lại ở đây, không chạy xuống reset()
      // Giúp giữ nguyên dữ liệu đã nhập trong các ô Input
      console.error('Form giữ nguyên dữ liệu để sửa lỗi.')
    }
  }

  return (
    <Sheet open={isFormOpen} onOpenChange={() => setIsFormOpen(false)}>
      <SheetContent
        className='w-full sm:max-w-md overflow-y-auto no-scrollbar bg-white border-l p-0'
        data-lenis-prevent
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SheetHeader className='p-6 pb-4 border-b bg-slate-50/50'>
            <SheetTitle className='text-lg font-black uppercase tracking-tighter flex items-center gap-2'>
              {editingUser ? 'Cập nhật' : 'Thêm mới'}
              <span className={isStaff ? 'text-primary' : 'text-indigo-600'}>
                {isStaff ? 'nhân viên' : 'khách hàng'}
              </span>
            </SheetTitle>
          </SheetHeader>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            className='px-6 py-4 space-y-5'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {/* THÔNG TIN CHUNG */}
            <motion.div variants={itemVariants} className='space-y-4'>
              <div className='space-y-1.5'>
                <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                  <User size={14} /> Họ và tên
                </Label>
                <Input
                  {...register('fullName', {})}
                  onFocus={e => e.target.select()}
                  placeholder='VD: Nguyen Van A'
                  className={`rounded-full bg-slate-50 h-10 focus-visible:ring-1 ${errors.fullName ? 'ring-1 ring-red-500' : ''}`}
                />
                <ErrorMessage message={errors.fullName?.message as string} />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                  <Phone size={14} /> Điện thoại
                </Label>
                <Input
                  {...register('phone')}
                  onFocus={e => e.target.select()}
                  placeholder='777...'
                  className={`rounded-full bg-slate-50 h-10 focus-visible:ring-1 ${errors.phone ? 'ring-1 ring-red-500' : ''}`}
                />
                <ErrorMessage message={errors.phone?.message as string} />
              </div>
              <div className='space-y-1.5'>
                <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                  <Mail size={14} /> Email
                </Label>
                <Input
                  {...register('email')}
                  onFocus={e => e.target.select()}
                  placeholder='example@gmail.com'
                  className={`rounded-full bg-slate-50 h-10 focus-visible:ring-1 ${errors.email ? 'ring-1 ring-red-500' : ''}`}
                />
                <ErrorMessage message={errors.email?.message as string} />
              </div>
            </motion.div>

            {!isStaff && (
              <motion.div variants={itemVariants} className='space-y-4 pt-2'>
                <Separator className='opacity-50' />

                <div className='space-y-3'>
                  <Label className='text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2 ml-1'>
                    <MapPin size={14} /> Địa chỉ
                  </Label>

                  {/* Street */}
                  <div className='space-y-1.5'>
                    <Input
                      {...register('street')}
                      placeholder='Số nhà, tên đường...'
                      className='rounded-full bg-slate-50 h-10 focus-visible:ring-1'
                    />
                  </div>

                  {/* Province & Postal Code */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-1.5'>
                      <Input
                        {...register('province')}
                        placeholder='Thành phố / Tỉnh'
                        className='rounded-full bg-slate-50 h-10 focus-visible:ring-1'
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <Input
                        {...register('postalCode')}
                        placeholder='Mã bưu điện (PSC)'
                        className='rounded-full bg-slate-50 h-10 focus-visible:ring-1'
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PHẦN RIÊNG CHO STAFF */}
            {isStaff && (
              <motion.div variants={itemVariants} className='space-y-4 pt-2'>
                {filteredRoles.length > 0 && (
                  <div className='space-y-1.5'>
                    <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                      <ShieldCheck size={14} /> Vai trò hệ thống
                    </Label>
                    <Controller
                      name='role'
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className={`rounded-full w-full bg-slate-50 h-11 shadow-none focus:ring-0 focus:ring-offset-0 
                        focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${errors.role ? 'ring-1 ring-primary' : ''}`}
                          >
                            <SelectValue placeholder='Chọn Role' />
                          </SelectTrigger>
                          <SelectContent
                            position='popper'
                            sideOffset={5}
                            className='rounded-xl border-slate-100 z-10000 bg-white'
                          >
                            {filteredRoles.map(opt => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className='text-xs font-medium'
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <ErrorMessage message={errors.role?.message as string} />
                  </div>
                )}

                <div className='space-y-1.5'>
                  <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                    <Briefcase size={14} /> Chức vụ
                  </Label>
                  <Input
                    {...register('position')}
                    onFocus={e => e.target.select()}
                    placeholder='Vị trí...'
                    className={`rounded-full bg-slate-50 h-10 focus-visible:ring-1 ${errors.position ? 'ring-1 ring-red-500' : ''}`}
                  />
                  <ErrorMessage message={errors.position?.message as string} />
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                    <Clock size={14} /> Lương / Giờ
                  </Label>
                  <div className='relative'>
                    <Input
                      {...register('hourlyRate')}
                      onFocus={e => e.target.select()}
                      type='number'
                      className={`rounded-full bg-slate-50 h-10 pr-8 focus-visible:ring-1 ${errors.hourlyRate ? 'ring-1 ring-red-500' : ''}`}
                    />
                    <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400'>
                      Kč
                    </span>
                  </div>
                  <ErrorMessage
                    message={errors.hourlyRate?.message as string}
                  />
                </div>
              </motion.div>
            )}

            {/* PHẦN RIÊNG CHO CUSTOMER */}
            {!isStaff && (
              <motion.div
                variants={itemVariants}
                className='space-y-4 pt-4 border-t border-dashed'
              >
                <Label className='text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2 ml-1'>
                  <Building2 size={14} /> Thông tin Công ty
                </Label>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <Label className='text-[9px] font-medium text-slate-400 ml-3'>
                      ICO
                    </Label>
                    <div className='relative'>
                      <Input
                        {...register('ico')}
                        placeholder='12345...'
                        className='rounded-full bg-indigo-50/30 border-indigo-100 h-10'
                      />
                      {isFetching && (
                        <Loader2
                          size={14}
                          className='absolute right-3 top-3 animate-spin text-indigo-500'
                        />
                      )}
                    </div>
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-[9px] font-medium text-slate-400 ml-3'>
                      DIC
                    </Label>
                    <Input
                      {...register('dic')}
                      placeholder='CZ...'
                      className='rounded-full bg-slate-50 h-10'
                    />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-[9px] font-medium text-slate-400 ml-3'>
                    Tên công ty
                  </Label>
                  <Input
                    {...register('companyName')}
                    placeholder='Tên doanh nghiệp...'
                    className='rounded-full bg-slate-50 h-10'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-[9px] font-medium text-slate-400 ml-3'>
                    Địa chỉ công ty
                  </Label>
                  <Input
                    {...register('address')}
                    placeholder='Địa chỉ trụ sở...'
                    className='rounded-full bg-slate-50 h-10 text-xs italic text-slate-500'
                    // Để address là read-only nếu muốn dữ liệu chuẩn từ ARES
                  />
                </div>
              </motion.div>
            )}

            <Separator className='my-2' />

            {/* BẢO MẬT */}
            <motion.div variants={itemVariants} className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 ml-1'>
                  <Lock size={14} /> Bảo mật
                </Label>
                {editingUser && (
                  <span className='text-[9px] text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-md border border-amber-100'>
                    <CircleAlert size={10} className='inline mr-1' /> Để trống
                    nếu không đổi
                  </span>
                )}
              </div>

              <div className='space-y-3'>
                <div className='relative'>
                  <Input
                    {...register('password')}
                    onFocus={e => e.target.select()}
                    type={showPass ? 'text' : 'password'}
                    placeholder='Mật khẩu'
                    className={`rounded-full bg-slate-50 h-10 pr-10 focus-visible:ring-1 ${errors.password ? 'ring-1 ring-red-500' : ''}`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPass(!showPass)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <ErrorMessage message={errors.password?.message as string} />
                </div>
                <div className='relative'>
                  <Input
                    {...register('confirmPassword')}
                    onFocus={e => e.target.select()}
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder='Xác nhận mật khẩu'
                    className={`rounded-full bg-slate-50 h-10 pr-10 focus-visible:ring-1 ${errors.confirmPassword ? 'ring-1 ring-red-500' : ''}`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <ErrorMessage
                    message={errors.confirmPassword?.message as string}
                  />
                </div>
              </div>
            </motion.div>

            {/* TRẠNG THÁI TÀI KHOẢN */}
            <motion.div
              variants={itemVariants}
              className={`px-4 py-1 rounded-3xl border ${isBlocked ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-full ${isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                  >
                    {isBlocked ? (
                      <ShieldAlert size={18} />
                    ) : (
                      <ShieldCheck size={18} />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-black ${isBlocked ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {isBlocked ? 'ĐANG BỊ KHÓA' : 'ĐANG HOẠT ĐỘNG'}
                    </p>
                  </div>
                </div>
                <Controller
                  name='isBlock'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={!field.value}
                      onCheckedChange={checked => field.onChange(!checked)}
                      className='cursor-pointer'
                    />
                  )}
                />
              </div>
            </motion.div>

            <DrawerFooter
              onCancel={() => setIsFormOpen(false)}
              isSubmitting={isSubmitting}
              variants={itemVariants}
            />
          </motion.div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default UserFormDrawer
