import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import categoryApi from '@/apis/category.api'
import { userApi } from '@/apis/user.api'
import { extractIdFromNameId } from '@/lib/utils'
import SellerDetail from '@/app/(shop)/sellers/[nameId]/seller-detail'

type SellerDetailPageProps = {
  params: Promise<{
    nameId: string
  }>
}

export async function generateMetadata({ params }: SellerDetailPageProps): Promise<Metadata> {
  const { nameId } = await params
  const sellerId = extractIdFromNameId(nameId)
  if (!sellerId) {
    return {
      title: 'Không tìm thấy người bán',
      description: 'Người bán không tồn tại trên hệ thống',
    }
  }

  try {
    const res = await userApi.getSellerDetail(sellerId)
    const seller = res.payload
    return {
      title: `${seller.name || 'Người bán'} | Nest E-Commerce`,
      description: `Khám phá các sản phẩm tuyệt vời của người bán ${seller.name || ''} tại Nest E-Commerce.`,
      openGraph: {
        title: seller.name || 'Người bán',
        description: `Khám phá các sản phẩm tuyệt vời của người bán ${seller.name || ''} tại Nest E-Commerce.`,
        images: seller.avatar ? [seller.avatar] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Người bán | Nest E-Commerce',
      description: 'Chi tiết người bán tại Nest E-Commerce',
    }
  }
}

export default async function SellerDetailPage({ params }: SellerDetailPageProps) {
  const { nameId } = await params
  const sellerId = extractIdFromNameId(nameId)
  if (!sellerId) {
    notFound()
  }

  let seller = null
  let categories = []

  try {
    const [sellerRes, categoriesRes] = await Promise.all([
      userApi.getSellerDetail(sellerId),
      categoryApi.getList({ page: 1, limit: 100 }),
    ])
    seller = sellerRes.payload
    categories = categoriesRes.payload.data
  } catch (error) {
    console.error('Error fetching seller details:', error)
    notFound()
  }

  if (!seller) {
    notFound()
  }

  return <SellerDetail seller={seller} categories={categories} sellerId={sellerId} />
}
