import { Metadata } from 'next'

import BackButton from '@/app/(dashboard)/_components/back-button'
import CreateBrandForm from '@/app/(dashboard)/dashboard/brands/create-brand-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Thêm thương hiệu mới',
  description: 'Thêm thương hiệu mới vào hệ thống',
}

export default function DashboardNewBrandPage() {
  return (
    <div className="space-y-4">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thêm thương hiệu mới</CardTitle>
          <CardDescription>Điền thông tin thương hiệu mới vào form bên dưới</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateBrandForm />
        </CardContent>
      </Card>
    </div>
  )
}
