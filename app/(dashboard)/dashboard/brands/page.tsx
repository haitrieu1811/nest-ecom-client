import { Metadata } from 'next'

import BrandsTable from '@/app/(dashboard)/dashboard/brands/brands-table'

export const metadata: Metadata = {
  title: 'Thương hiệu',
  description: 'Quản lý thương hiệu sản phẩm',
}

export default function DashboardBrandsPage() {
  return <BrandsTable />
}
