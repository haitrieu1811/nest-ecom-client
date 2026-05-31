'use client'

import { CirclePlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { roleColumns } from '@/app/(dashboard)/dashboard/roles/columns'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import PATH from '@/constants/path'
import useDeleteRole from '@/hooks/use-delete-role'
import useRoles from '@/hooks/use-roles'

type RolesTableContext = {
  currentRoleId: number | null
  setCurrentRoleId: React.Dispatch<React.SetStateAction<number | null>>
}

const RolesTableContext = React.createContext<RolesTableContext | undefined>(undefined)

export const useRolesTableContext = () => React.useContext(RolesTableContext)!

export default function RolesTable() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'

  const { roles, totalRoles, getAllRolesQuery } = useRoles({ page: Number(page), limit: Number(limit) })

  const [currentRoleId, setCurrentRoleId] = React.useState<number | null>(null)

  const { deleteRoleMutation } = useDeleteRole({
    onSuccess: () => {
      setCurrentRoleId(null)
      getAllRolesQuery.refetch()
    },
  })

  const handleDeleteRole = () => {
    if (!currentRoleId) return
    deleteRoleMutation.mutate(currentRoleId)
  }

  return (
    <RolesTableContext value={{ currentRoleId, setCurrentRoleId }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Roles ({totalRoles})</CardTitle>
          <CardDescription>Quản lý các role và phân quyền cho người dùng</CardDescription>
          <CardAction>
            <Button asChild size="sm" variant="outline">
              <Link href={PATH.DASHBOARD_ROLES_NEW}>
                <CirclePlusIcon />
                Thêm role mới
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={roleColumns} data={roles} />
        </CardContent>
      </Card>

      {/* Xóa role */}
      <AlertDialogDestructive
        open={!!currentRoleId}
        onOpenChange={(open) => !open && setCurrentRoleId(null)}
        title="Xóa role?"
        description="Hành động này sẽ xóa vĩnh viễn role này. Hãy chắc chắn rằng bạn muốn tiếp tục."
        onConfirm={handleDeleteRole}
      />
    </RolesTableContext>
  )
}
