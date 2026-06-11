import { Metadata } from 'next'

import categoryApi from '@/apis/category.api'
import { productApi } from '@/apis/product.api'
import userApi from '@/apis/user.api'
import FlashSale from '@/app/(shop)/_components/flash-sale'
import HomeCarousel from '@/app/(shop)/_components/home-carousel'
import HomeCategories from '@/app/(shop)/_components/home-categories'
import HomePosts from '@/app/(shop)/_components/home-posts'

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Chào mừng đến với cửa hàng của chúng tôi! Khám phá các sản phẩm chất lượng và ưu đãi hấp dẫn ngay hôm nay.',
}

export default async function HomePage() {
  const [getCategoriesRes, getProductsRes] = await Promise.all([
    categoryApi.getList(),
    productApi.getList(),
    userApi.getSellers({ page: 1, limit: 8 }),
  ])
  const categories = getCategoriesRes.payload.data
  const products = getProductsRes.payload.data

  return (
    <div className="grid gap-4 py-4">
      <HomeCarousel />
      <HomeCategories categories={categories} />
      <FlashSale products={products} />
      <HomePosts />
    </div>
  )
}
