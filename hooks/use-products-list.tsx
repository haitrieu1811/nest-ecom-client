import { useQuery } from '@tanstack/react-query'

import { productApi } from '@/apis/product.api'

export default function useProductList() {
  const getProductsListQuery = useQuery({
    queryKey: ['get-products-list'],
    queryFn: () => productApi.getList(),
  })

  const products = getProductsListQuery.data?.payload.data ?? []
  const pagination = getProductsListQuery.data?.payload.pagination

  return {
    getProductsListQuery,
    products,
    pagination,
  }
}
