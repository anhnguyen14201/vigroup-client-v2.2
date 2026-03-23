import * as z from 'zod'

export const registerSchema = z
  .object({
    shopName: z.string().trim().min(1, 'Tên cửa hàng không được để trống'),
    fullName: z
      .string()
      .trim()
      .min(1, 'Họ tên không được để trống')
      .regex(/^[a-zA-ZÀ-ỹ\s]{2,}$/, 'Họ tên không hợp lệ'),
    email: z
      .string()
      .trim()
      .min(1, 'Email không được để trống')
      .email('Email không đúng định dạng')
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .min(1, 'SĐT không được để trống')
      .regex(/^(?:\+|\d)\d{8,14}$/, 'SĐT từ 9-15 số'),
    password: z
      .string()
      .min(8, 'Mật khẩu ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Cần 1 chữ in hoa')
      .regex(/[0-9]/, 'Cần 1 chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    ico: z.string().trim().min(1, 'ICO không được để trống'),
    dic: z.string().trim().min(1, 'DIC không được để trống'),
    location: z.string().trim().min(1, 'Địa điểm không được để trống'),
    address: z.string().trim().min(1, 'Địa điểm không được để trống'),
    companyName: z
      .string()
      .trim()
      .min(1, 'Tên doanh nghiệp không được để trống'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'], // Hiển thị lỗi tại ô confirmPasswod
  })

export const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})
