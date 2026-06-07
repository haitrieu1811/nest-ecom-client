import { Metadata } from 'next'

import Settings from '@/app/(shop)/account/settings/settings'

export const metadata: Metadata = {
  title: 'Cài đặt tài khoản',
  description: 'Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.',
}

export default function AccountSettingsPage() {
  return <Settings />
}
