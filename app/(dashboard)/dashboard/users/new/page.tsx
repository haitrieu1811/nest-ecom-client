import { Metadata } from 'next'

import CreateUserForm from '@/app/(dashboard)/dashboard/users/create-user-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BackButton from '@/app/(dashboard)/_components/back-button'

export const metadata: Metadata = {
  title: 'Thêm người dùng mới',
  description: 'Thêm người dùng mới vào hệ thống',
}

export default function DashboardNewUserPage() {
  return (
    <div className="space-y-4">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thêm người dùng mới</CardTitle>
          <CardDescription>Điền thông tin người dùng mới vào form bên dưới</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  )
}
