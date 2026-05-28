import { useQuery } from '@tanstack/react-query'

import roleApi from '@/apis/role.api'

type UseRolesProps = {
  page: number
  limit: number
}

export default function useRoles({ page, limit }: UseRolesProps = { page: 1, limit: 10 }) {
  const getAllRolesQuery = useQuery({
    queryKey: ['get-all-roles', page, limit],
    queryFn: () => roleApi.getAll({ page, limit }),
  })

  const roles = getAllRolesQuery.data?.payload.data || []
  const totalRoles = getAllRolesQuery.data?.payload.totalRows || 0

  return {
    getAllRolesQuery,
    roles,
    totalRoles,
  }
}
