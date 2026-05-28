import { Metadata } from 'next'

import BackButton from '@/app/(dashboard)/_components/back-button'
import CreateRoleForm from '@/app/(dashboard)/dashboard/roles/create-role-form'

export const metadata: Metadata = {
  title: 'Tạo role mới',
  description: 'Tạo role mới, phân quyền cho người dùng',
}

export default function DashboardNewRolePage() {
  return (
    <div className="space-y-4">
      <BackButton />
      <CreateRoleForm />
    </div>
  )
}
