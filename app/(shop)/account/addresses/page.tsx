import { Metadata } from 'next'

import Addresses from '@/app/(shop)/account/addresses/addresses'

export const metadata: Metadata = {
  title: 'Địa chỉ',
  description: 'Quản lý địa chỉ giao hàng của bạn.',
}

export default function AccountAddressesPage() {
  return <Addresses />
}
