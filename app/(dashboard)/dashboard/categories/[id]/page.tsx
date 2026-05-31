import { Metadata } from 'next'

import CategoryDetail from '@/app/(dashboard)/dashboard/categories/[id]/category-detail'

export const metadata: Metadata = {
  title: 'Chi tiết danh mục',
  description: 'Xem và chỉnh sửa chi tiết danh mục sản phẩm.',
}

export default function DashboardCategoryDetailPage() {
  return <CategoryDetail />
}
