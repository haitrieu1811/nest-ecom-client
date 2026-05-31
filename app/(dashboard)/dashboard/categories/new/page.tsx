import { Metadata } from 'next'

import BackButton from '@/app/(dashboard)/_components/back-button'
import CreateCategoryForm from '@/app/(dashboard)/dashboard/categories/create-category-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Thêm danh mục mới',
  description: 'Thêm danh mục mới vào hệ thống',
}

export default function DashboardNewCategoryPage() {
  return (
    <div className="space-y-4">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thêm danh mục mới</CardTitle>
          <CardDescription>Điền thông tin danh mục mới vào form bên dưới</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
