'use client'

import { useQuery } from '@tanstack/react-query'

import permissionApi from '@/apis/permission.api'

export default function useAllPermissions() {
  const getAllPermissionsQuery = useQuery({
    queryKey: ['get-permissions'],
    queryFn: () => permissionApi.getAll(),
    staleTime: 1000 * 60 * 60, // 1 giờ
  })

  const permissions = getAllPermissionsQuery.data?.payload.data || []
  const totalPermissions = getAllPermissionsQuery.data?.payload.totalRows || 0

  return {
    getAllPermissionsQuery,
    permissions,
    totalPermissions,
  }
}
