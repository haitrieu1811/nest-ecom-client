import { Metadata } from 'next'

import PermissionsTable from '@/app/(dashboard)/dashboard/permissions/permissions-table'

export const metadata: Metadata = {
  title: 'Quản lý permissions',
  description: 'Quản lý permissions.',
}

export default function DashboardPermissionsPage() {
  return <PermissionsTable />
}
