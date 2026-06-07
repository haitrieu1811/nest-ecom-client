import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { productColumns } from '@/app/(dashboard)/dashboard/products/columns'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import PATH from '@/constants/path'
import { ProductIncludeTranslationsType } from '@/schemas/product.schema'

interface ProductsTableProps {
  products: ProductIncludeTranslationsType[]
  totalProducts: number
}

export default function ProductsTable({ products, totalProducts }: ProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Danh sách sản phẩm ({totalProducts})</CardTitle>
        <CardDescription>Quản lý sản phẩm</CardDescription>
        <CardAction>
          <Button asChild variant="outline">
            <Link href={PATH.DASHBOARD_PRODUCTS_NEW}>
              <PlusCircle />
              Thêm sản phẩm mới
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={productColumns} data={products} />
      </CardContent>
    </Card>
  )
}
