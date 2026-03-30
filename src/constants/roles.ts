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

export const ROLE_MAP = {
  SUPER_ADMIN: '3515',
  ADMIN: '1413914',
  MANAGER: '1311417518',
  STAFF: '5131612152555',
  ACCOUNTANT: '19531852011825',
  SUPPLIER: '22125518',
  WEB_MANAGER: '23521311920518',
  CUSTOMER: '32119201513518',
}

export const ROLE_OPTIONS = [
  { value: ROLE_MAP.ADMIN, label: 'Admin' },
  { value: ROLE_MAP.MANAGER, label: 'Quản lý hệ thống' },
  { value: ROLE_MAP.ACCOUNTANT, label: 'Kế toán' },
  { value: ROLE_MAP.SUPPLIER, label: 'Nhân viên - Vật tư' },
  { value: ROLE_MAP.WEB_MANAGER, label: 'Quản trị viên' },
  { value: ROLE_MAP.STAFF, label: 'Nhân viên' },
]
