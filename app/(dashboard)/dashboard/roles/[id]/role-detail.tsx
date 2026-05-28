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
import Loading from '@/components/loading'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PATH from '@/constants/path'
import useDeleteRole from '@/hooks/use-delete-role'
import { cn } from '@/lib/utils'

export default function RoleDetail() {
  const router = useRouter()

  const params = useParams<{ id: string }>()
  const roleId = Number(params.id)

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2Icon className="size-4" />
                  Xóa role
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Bạn có chắc muốn xóa role này không?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác. Tất cả người dùng có role này sẽ bị ảnh hưởng.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Hủy bỏ</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteRoleMutation.isPending}
                    variant="destructive"
                    onClick={() => deleteRoleMutation.mutate(role.id)}
                  >
                    {deleteRoleMutation.isPending && <Spinner />}
                    Tiếp tục
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
