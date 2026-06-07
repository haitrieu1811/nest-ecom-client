import { Metadata } from 'next'
import { cookies } from 'next/headers'

import { manageProductApi } from '@/apis/product.api'
import ProductsTable from '@/app/(dashboard)/dashboard/products/products-table'
import { ORDER_BY, OrderByType, SORT_BY, SortByType } from '@/constants/utils.constant'
import { jwtDecoded } from '@/lib/utils'
import { AccessTokenPayload } from '@/types/utils.type'

export const metadata: Metadata = {
  title: 'Quản lý sản phẩm | Nest Ecom',
  description:
    'Xem danh sách, chỉnh sửa thông tin, quản lý hình ảnh và phân loại sản phẩm của bạn một cách dễ dàng với giao diện chuyên nghiệp và hiện đại.',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function DashboardManageProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  if (!accessToken) {
    return (
      <div className="p-10">
        <p className="text-muted-foreground">Bạn chưa đăng nhập</p>
      </div>
    )
  }

  const decodedAccessToken = jwtDecoded<AccessTokenPayload>(accessToken)

  const params = await searchParams
  const page = params?.page ? Number(params.page) : 1
  const limit = params?.limit ? Number(params.limit) : 10
  const sortBy = (params?.sortBy as SortByType) || SORT_BY.CREATED_AT
  const orderBy = (params?.orderBy as OrderByType) || ORDER_BY.DESC

  const getManageProductsRes = await manageProductApi.sGetAll(
    {
      page,
      limit,
      createdById: decodedAccessToken.userId,
      sortBy,
      orderBy,
    },
    accessToken,
  )
  const products = getManageProductsRes.payload.data || []
  const totalProducts = getManageProductsRes.payload.pagination.totalRows || 0

  return <ProductsTable products={products} totalProducts={totalProducts} />
}
