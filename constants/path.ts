import { generateNameId } from '@/lib/utils'

const PATH = {
  HOME: '/',
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (name: string, id: number) => `/categories/${generateNameId(name, id)}`,

  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token',

  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_CHANGE_PASSWORD: '/account/change-password',
  ACCOUNT_SETTINGS: '/account/settings',

  DASHBOARD: '/dashboard',
  DASHBOARD_USERS: '/dashboard/users',
  DASHBOARD_USERS_NEW: '/dashboard/users/new',
  DASHBOARD_USERS_DETAIL: (userId: number) => `/dashboard/users/${userId}`,
  DASHBOARD_ROLES: '/dashboard/roles',
  DASHBOARD_ROLES_NEW: '/dashboard/roles/new',
  DASHBOARD_ROLES_DETAIL: (roleId: number) => `/dashboard/roles/${roleId}`,
  DASHBOARD_PERMISSIONS: '/dashboard/permissions',
  DASHBOARD_CATEGORIES: '/dashboard/categories',
  DASHBOARD_CATEGORIES_NEW: '/dashboard/categories/new',
  DASHBOARD_CATEGORIES_DETAIL: (categoryId: number) => `/dashboard/categories/${categoryId}`,
  DASHBOARD_BRANDS: '/dashboard/brands',
  DASHBOARD_BRANDS_NEW: '/dashboard/brands/new',
  DASHBOARD_BRANDS_DETAIL: (brandId: number) => `/dashboard/brands/${brandId}`,
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_PRODUCTS_NEW: '/dashboard/products/new',
} as const

export default PATH
