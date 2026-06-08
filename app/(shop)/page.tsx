import { Metadata } from 'next'
import Link from 'next/link'

import categoryApi from '@/apis/category.api'
import HomeCarousel from '@/app/(shop)/_components/home-carousel'
import HomeCategories from '@/app/(shop)/_components/home-categories'
import HomePosts from '@/app/(shop)/_components/home-posts'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import FlashSale from '@/app/(shop)/_components/flash-sale'
import { productApi } from '@/apis/product.api'

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Chào mừng đến với cửa hàng của chúng tôi! Khám phá các sản phẩm chất lượng và ưu đãi hấp dẫn ngay hôm nay.',
}

export default async function HomePage() {
  const [getCategoriesRes, getProductsRes] = await Promise.all([categoryApi.getList(), productApi.getList()])
  const categories = getCategoriesRes.payload.data
  const products = getProductsRes.payload.data

  return (
    <div className="grid gap-4 py-4">
      <HomeCarousel />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh mục sản phẩm</CardTitle>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href={PATH.CATEGORIES}>Xem tất cả</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <HomeCategories categories={categories} />
        </CardContent>
      </Card>
      <FlashSale products={products} />
      <HomePosts />
    </div>
  )
}
