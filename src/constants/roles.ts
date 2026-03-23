// Định nghĩa các Role cơ bản để tránh dùng "string" linh tinh trong code
export const ROLES = {
  CEO: 3515,
  ADMIN: 1413914,
  MANAGER: 1311417518,
  WEBMASTER: 23521311920518,
  EMPLOYEE: 5131612152555,
  SECRETARY: 19531852011825,
  BUYER: 22125518,
} as const

// Nhóm các Role có quyền vào hệ thống Quản trị (Admin Panel)
export const ADMIN_ACCESS_ROLES = [
  ROLES.CEO,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.WEBMASTER,
]

// Nhóm các Role có quyền vào hệ thống Nhân viên (Employee Portal)
export const EMPLOYEE_ACCESS_ROLES = [
  ROLES.CEO,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.WEBMASTER,
  ROLES.EMPLOYEE,
  ROLES.SECRETARY,
  ROLES.BUYER,
]
