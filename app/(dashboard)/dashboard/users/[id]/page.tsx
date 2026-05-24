import { Metadata } from 'next'

import UserDetail from '@/app/(dashboard)/dashboard/users/[id]/user-detail'

export const metadata: Metadata = {
  title: 'Chi tiết người dùng',
  description: 'Xem chi tiết thông tin người dùng',
}

export default function DashboardUserDetailPage() {
  return <UserDetail />
}
