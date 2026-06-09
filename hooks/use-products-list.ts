import { useQuery } from '@tanstack/react-query'

import { productApi } from '@/apis/product.api'
import { GetProductsQueryType } from '@/schemas/product.schema'

export default function useProductsList(
  query?: GetProductsQueryType & {
    enabled?: boolean
  },
) {
  const { enabled = true, ...restQuery } = query || {}

  const getProductsListQuery = useQuery({
    queryKey: ['get-products-list', restQuery],
    queryFn: () => productApi.getList(restQuery),
    enabled,
  })

  const products = getProductsListQuery.data?.payload.data ?? []
  const pagination = getProductsListQuery.data?.payload.pagination

  return {
    getProductsListQuery,
    products,
    pagination,
  }
}
