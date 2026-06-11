/* eslint-disable @typescript-eslint/no-explicit-any */

import { Metadata } from 'next'

import categoryApi from '@/apis/category.api'
import CategoriesClient from '@/app/(shop)/categories/categories-client'

export const metadata: Metadata = {
  title: 'Tất cả Danh mục Sản phẩm | Nest Ecom',
  description: 'Khám phá danh sách các danh mục sản phẩm phong phú và chất lượng tại Nest Ecom.',
}

export default async function CategoriesPage() {
  let initialCategories: any = []

  try {
    const res = await categoryApi.getList({ page: 1, limit: 100 })
    initialCategories = res?.payload?.data || []
  } catch (error) {
    console.error('Error fetching categories on server side SSR:', error)
  }

  return (
    <div className="w-full">
      <CategoriesClient initialCategories={initialCategories} />
    </div>
  )
}
