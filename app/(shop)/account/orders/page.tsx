import { Metadata } from 'next'

import MyOrders from '@/app/(shop)/account/orders/my-orders'

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi',
  description: 'Xem và quản lý các đơn hàng của bạn.',
}

export default function AccountOrdersPage() {
  return <MyOrders />
}
