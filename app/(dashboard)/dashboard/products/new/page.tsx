import { Metadata } from 'next'

import CreateProductForm from '@/app/(dashboard)/dashboard/products/_create-product-form'

export const metadata: Metadata = {
  title: 'Thêm sản phẩm mới',
  description: 'Thêm sản phẩm mới vào cửa hàng của bạn',
}

export default function DashboardNewProductPage() {
  return <CreateProductForm />
}
