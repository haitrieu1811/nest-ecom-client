import { Metadata } from 'next'

import UsersTable from '@/app/(dashboard)/dashboard/users/users-table'

export const metadata: Metadata = {
  title: 'Người dùng - Dashboard',
  description: 'Quản lý người dùng trong dashboard',
}

export default function DashboardUsersPage() {
  return <UsersTable />
}
