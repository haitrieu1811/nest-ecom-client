import { Metadata } from 'next'

import RolesTable from '@/app/(dashboard)/dashboard/roles/roles-table'

export const metadata: Metadata = {
  title: 'Phân quyền',
  description: 'Quản lý phân quyền cho người dùng',
}

export default function DashboardRolesPage() {
  return <RolesTable />
}
