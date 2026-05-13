import { Metadata } from 'next'

import AccountForm from '@/components/account-form'
import ChangePasswordForm from '@/components/change-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Quản lý tài khoản của bạn',
}

export default function DashboardProfilePage() {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <Card className="col-span-12 md:col-span-6">
        <CardHeader>
          <CardTitle>Tài khoản</CardTitle>
          <CardDescription>Quản lý tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm />
        </CardContent>
      </Card>
      <Card className="col-span-12 md:col-span-6">
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Đổi mật khẩu của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
