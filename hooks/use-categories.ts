import { useQuery } from '@tanstack/react-query'

import categoryApi from '@/apis/category.api'
import { GetCategoriesQueryType } from '@/schemas/category.schema'

type UseCategoriesProps = {
  query?: GetCategoriesQueryType
  enabled?: boolean
}

export default function useCategories(props?: UseCategoriesProps) {
  const getCategoriesQuery = useQuery({
    queryKey: ['get-categories', props?.query],
    queryFn: () => categoryApi.getList(props?.query),
    enabled: props?.enabled || true,
  })

  const categories = getCategoriesQuery.data?.payload.data || []
  const totalCategories = getCategoriesQuery.data?.payload.totalItems || 0

  return {
    categories,
    totalCategories,
    getCategoriesQuery,
  }
}
