import { Metadata } from 'next'

import Dashboard from '@/app/(dashboard)/dashboard/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | Nest Ecom',
  description:
    'Quản lý cửa hàng của bạn với Nest Ecom Dashboard. Theo dõi doanh số, quản lý sản phẩm, và tối ưu hóa hiệu suất kinh doanh của bạn một cách dễ dàng.',
}

export default function DashboardPage() {
  return <Dashboard />
}
