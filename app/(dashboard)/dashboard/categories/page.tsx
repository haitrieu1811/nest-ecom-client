import { Metadata } from 'next'

import CategoriesTable from '@/app/(dashboard)/dashboard/categories/categories-table'

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm',
  description: 'Quản lý danh mục sản phẩm',
}

export default function DashboardCategoriesPage() {
  return <CategoriesTable />
}
