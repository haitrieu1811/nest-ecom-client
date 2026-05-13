const PATH = {
  HOME: '/',
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
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_PRODUCTS_NEW: '/dashboard/products/new',
} as const

export default PATH
