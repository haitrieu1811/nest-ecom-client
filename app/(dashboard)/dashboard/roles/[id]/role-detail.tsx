'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Trash2Icon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import roleApi from '@/apis/role.api'
import BackButton from '@/app/(dashboard)/_components/back-button'
import CreateRoleForm from '@/app/(dashboard)/dashboard/roles/create-role-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import Loading from '@/components/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PATH from '@/constants/path'
import useDeleteRole from '@/hooks/use-delete-role'
import { cn } from '@/lib/utils'

export default function RoleDetail() {
  const router = useRouter()

  const params = useParams<{ id: string }>()
  const roleId = Number(params.id)

  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  const getRoleDetailQuery = useQuery({
    queryKey: ['get-role-detail', roleId],
    queryFn: () => roleApi.getDetail(roleId),
  })

  const role = getRoleDetailQuery.data?.payload

  const { deleteRoleMutation } = useDeleteRole({
    onSuccess: () => {
      router.push(PATH.DASHBOARD_ROLES)
    },
  })

  return (
    <React.Fragment>
      {role && !getRoleDetailQuery.isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <BackButton />
              <div>
                <h1 className="text-xl font-semibold">{role.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Đã tạo{' '}
                  {formatDistanceToNow(new Date(role.createdAt), {
                    locale: vi,
                    addSuffix: true,
                  })}
                </p>
              </div>
              <Badge
                className={cn({
                  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100': role.isActive,
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100': !role.isActive,
                })}
              >
                {role.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
              </Badge>
            </div>
            {/* Xóa role */}
            <Button variant="destructive" size="sm" onClick={() => setIsDeleting(true)}>
              <Trash2Icon className="size-4" />
              Xóa role
            </Button>
            <AlertDialogDestructive
              open={isDeleting}
              onOpenChange={setIsDeleting}
              title="Xóa role?"
              description="Điều này sẽ xóa vĩnh viễn role này. Bạn có chắc chắn muốn tiếp tục?"
              onConfirm={() => deleteRoleMutation.mutate(role.id)}
            />
          </div>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="users">Người đang sử dụng</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <CreateRoleForm roleData={role} onUpdateSuccess={() => getRoleDetailQuery.refetch()} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {getRoleDetailQuery.isLoading && <Loading />}
    </React.Fragment>
  )
}
