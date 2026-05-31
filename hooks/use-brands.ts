import { useQuery } from '@tanstack/react-query'

import brandApi from '@/apis/brand.api'
import { GetBrandsQueryType } from '@/schemas/brand.schema'

type UseBrandsProps = {
  query?: GetBrandsQueryType
  enabled?: boolean
}

export default function useBrands(props?: UseBrandsProps) {
  const getBrandsQuery = useQuery({
    queryKey: ['get-brands', props?.query],
    queryFn: () => brandApi.getList(props?.query),
    enabled: props?.enabled || true,
  })

  const brands = getBrandsQuery.data?.payload.data || []
  const totalBrands = getBrandsQuery.data?.payload.totalItems || 0

  return {
    brands,
    totalBrands,
    getBrandsQuery,
  }
}
