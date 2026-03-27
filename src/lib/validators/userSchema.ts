import * as z from 'zod'

export const userSchema = z
  .object({
    // THÔNG TIN CHUNG
    fullName: z.string().trim().min(1, 'Họ tên không được để trống'),
    phone: z
      .string()
      .trim()
      .min(1, 'SĐT không được để trống')
      .regex(/^(?:\+|\d)\d{8,14}$/, 'SĐT từ 9-15 số'),
    email: z
      .string()
      .trim()
      .email('Email không đúng định dạng')
      .or(z.literal('')),

    // PHÂN QUYỀN & TRẠNG THÁI
    role: z.string().min(1, 'Vui lòng chọn vai trò'),
    isBlock: z.boolean().default(true),

    // TRƯỜNG CHO NHÂN VIÊN (STAFF)
    position: z.string().trim().optional(),
    hourlyRate: z.preprocess(
      val => (val === '' ? undefined : val),
      z.coerce.number().min(0, 'Lương không được âm').optional(),
    ),

    // TRƯỜNG CHO KHÁCH HÀNG (CUSTOMER)
    companyName: z.string().trim().optional(),
    ico: z.string().trim().optional(),
    dic: z.string().trim().optional(),

    street: z.string().trim().optional(),
    province: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    address: z.string().trim().optional(),

    // BẢO MẬT
    password: z.string().trim().optional().or(z.literal('')),
    confirmPassword: z.string().trim().optional().or(z.literal('')),
  })
  // 1. Kiểm tra khớp mật khẩu
  .refine(
    data => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    },
  )

  // 2. Kiểm tra độ mạnh mật khẩu (Chỉ khi có nhập)
  .refine(
    data => {
      if (data.password && data.password.length > 0) {
        // Ít nhất 8 ký tự, 1 chữ hoa, 1 số
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
        return passwordRegex.test(data.password)
      }
      return true
    },
    {
      message: 'Mật khẩu phải từ 8 ký tự, có 1 chữ hoa và 1 chữ số',
      path: ['password'],
    },
  )
  // 3. Logic bắt buộc theo vai trò (Staff vs Customer)
  .superRefine((data, ctx) => {
    // Nếu là Khách hàng (Dựa trên role ID của bạn)
    const isCustomer = data.role === '32119201513518'

    if (!isCustomer) {
      if (!data.position || data.position.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập chức vụ nhân viên',
          path: ['position'],
        })
      }
    }
  })

export type UserSchemaType = z.infer<typeof userSchema>
