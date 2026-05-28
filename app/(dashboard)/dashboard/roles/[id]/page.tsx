import { Metadata } from 'next'

import RoleDetail from '@/app/(dashboard)/dashboard/roles/[id]/role-detail'

export const metadata: Metadata = {
  title: 'Chi tiết role',
  description: 'Xem chi tiết role',
}

export default function DashboardRoleDetailPage() {
  return <RoleDetail />
}
