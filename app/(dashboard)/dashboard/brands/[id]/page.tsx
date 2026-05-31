import { Metadata } from 'next'

import BrandDetail from '@/app/(dashboard)/dashboard/brands/[id]/brand-detail'

export const metadata: Metadata = {
  title: 'Chi tiết thương hiệu',
  description: 'Xem và chỉnh sửa chi tiết thương hiệu sản phẩm.',
}

export default function DashboardBrandDetailPage() {
  return <BrandDetail />
}
