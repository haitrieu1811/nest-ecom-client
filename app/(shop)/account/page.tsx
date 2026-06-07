import { Metadata } from 'next'

import AccountForm from '@/components/account-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Quản lý tài khoản của bạn',
}

export default function AccountPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Hồ sơ của tôi</CardTitle>
        <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <AccountForm />
      </CardContent>
    </Card>
  )
}
