'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale/vi'
import { ChevronLeftIcon, Trash2Icon, UserRoundIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import userApi from '@/apis/user.api'
import CreateUserForm from '@/app/(dashboard)/dashboard/users/create-user-form'
import Loading from '@/components/loading'
import NotFound from '@/components/not-found'
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
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { USER_STATUS } from '@/constants/auth.constant'
import PATH from '@/constants/path'
import useDeleteUser from '@/hooks/use-delete-user'
import { cn } from '@/lib/utils'

export default function UserDetail() {
  const router = useRouter()

  const params = useParams<{ id: string }>()
  const userId = params.id

  const getUserDetailQuery = useQuery({
    queryKey: ['get-user-detail', userId],
    queryFn: () => userApi.getDetail(Number(userId)),
    enabled: Number.isInteger(Number(userId)),
  })

  const user = getUserDetailQuery.data?.payload

  const { deleteUserMutation } = useDeleteUser({
    onSuccess: () => {
      router.push(PATH.DASHBOARD_USERS)
    },
  })

  return (
    <React.Fragment>
      {user && !getUserDetailQuery.isLoading && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ChevronLeftIcon />
              </Button>
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{user.email}</h3>
                  {user.name && <p className="text-sm text-muted-foreground">{user.name}</p>}
                </div>
                <Badge variant="outline">{user.role.name}</Badge>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2Icon className="size-4" />
                  Xóa người dùng
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này sẽ xóa vĩnh viễn người dùng khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Hủy bỏ</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteUserMutation.isPending}
                    variant="destructive"
                    onClick={() => deleteUserMutation.mutate(Number(userId))}
                  >
                    {deleteUserMutation.isPending && <Spinner />}
                    Tiếp tục
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="mt-6">
            <Tabs defaultValue="overview">
              <TabsList variant="line">
                <TabsTrigger value="overview">Thông tin chung</TabsTrigger>
                <TabsTrigger value="analytics">Phân tích</TabsTrigger>
                <TabsTrigger value="reports">Báo cáo</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 grid grid-cols-12 gap-4 items-start">
                <Card className="col-span-6">
                  <CardContent>
                    <CreateUserForm userData={user} />
                  </CardContent>
                </Card>
                <Card className="col-span-6">
                  <CardContent>
                    <Table>
                      <TableCaption>Thông tin bổ sung</TableCaption>
                      <TableBody>
                        <TableRow>
                          <TableCell>Tham gia từ</TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: vi })}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Cập nhật lần cuối</TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true, locale: vi })}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell>
                            <Badge
                              className={cn({
                                'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100':
                                  user.status === USER_STATUS.ACTIVE,
                                'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100':
                                  user.status === USER_STATUS.BLOCKED,
                              })}
                            >
                              {user.status === USER_STATUS.ACTIVE ? 'Hoạt động' : 'Bị khóa'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Vai trò</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role.name}</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>{user.id}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {!user && !getUserDetailQuery.isLoading && (
        <NotFound
          icon={UserRoundIcon}
          title="Không tìm thấy người dùng"
          description="Người dùng bạn đang tìm kiếm không tồn tại"
        />
      )}

      {getUserDetailQuery.isLoading && <Loading />}
    </React.Fragment>
  )
}
