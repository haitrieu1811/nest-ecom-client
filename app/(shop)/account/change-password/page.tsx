import { Metadata } from 'next'

import ChangePasswordForm from '@/components/change-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Thay đổi mật khẩu',
  description:
    'Trang thay đổi mật khẩu của người dùng, nơi bạn có thể cập nhật mật khẩu của mình để bảo vệ tài khoản và thông tin cá nhân.',
}

export default function ChangePasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thay đổi mật khẩu</CardTitle>
        <CardDescription>Cập nhật mật khẩu của bạn để bảo vệ tài khoản và thông tin cá nhân.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  )
}
