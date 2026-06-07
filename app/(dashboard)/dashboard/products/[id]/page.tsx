import { Metadata } from 'next'
import { cookies } from 'next/headers'

import { manageProductApi } from '@/apis/product.api'
import ManageProductDetail from '@/app/(dashboard)/dashboard/products/[id]/manage-product-detail'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    return {
      title: 'Chi tiết sản phẩm',
      description: 'Chi tiết sản phẩm',
    }
  }

  try {
    const res = await manageProductApi.sGetDetail(id, accessToken)
    const productData = res.payload
    return {
      title: productData.name,
      description: productData.description,
      openGraph: {
        images: productData.images,
      },
    }
  } catch {
    return {
      title: 'Chi tiết sản phẩm',
      description: 'Chi tiết sản phẩm',
    }
  }
}

export default async function DashboardManageProductDetailPage({ params }: Props) {
  const { id } = await params

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  let productData = null
  if (accessToken) {
    try {
      const res = await manageProductApi.sGetDetail(id, accessToken)
      productData = res.payload
    } catch {
      productData = null
    }
  }

  return <ManageProductDetail productData={productData} />
}

