'use client'

import { useQuery } from '@tanstack/react-query'
import { PlusCircleIcon, Trash2Icon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import userApi from '@/apis/user.api'
import { userColumns } from '@/app/(dashboard)/dashboard/users/columns'
import CreateUserForm from '@/app/(dashboard)/dashboard/users/create-user-form'
import SearchBox from '@/components/search-box'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import useDebounce from '@/hooks/use-debounce'
import useDeleteUser from '@/hooks/use-delete-user'
import { UserIncludeRoleType } from '@/schemas/user.schema'

type UserItemType = Omit<UserIncludeRoleType, 'password' | 'totpSecret'>

type UsersTableContextType = {
  currentUser: UserItemType | null
  currentUserId: number | null
  setCurrentUser: React.Dispatch<React.SetStateAction<UserItemType | null>>
  setCurrentUserId: React.Dispatch<React.SetStateAction<number | null>>
}

const UsersTableContext = React.createContext<UsersTableContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  currentUserId: null,
  setCurrentUserId: () => {},
})

export const useUsersTableContext = () => React.useContext(UsersTableContext)

export default function UsersTable() {
  const pathname = usePathname()
  const router = useRouter()

  const [currentUser, setCurrentUser] = React.useState<UserItemType | null>(null)
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null)

  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'
  const limit = searchParams.get('limit') ?? '10'
  const email = searchParams.get('email') ?? ''

  const [isOpenCreate, setOpenCreate] = React.useState<boolean>(false)
  const [emailSearch, setEmailSearch] = React.useState<string>(email)
  const emailDebounced = useDebounce(emailSearch, 1000)

  // Cập nhật URL khi emailDebounced thay đổi để kích hoạt query mới
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (!emailDebounced) {
      params.delete('email')
    } else {
      params.set('email', emailDebounced)
    }
    params.set('page', '1') // Reset về trang 1 khi tìm kiếm
    router.replace(`${pathname}?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailDebounced, pathname, router])

  const getAllUsersQuery = useQuery({
    queryKey: ['get-all-users', page, limit, emailDebounced],
    queryFn: () =>
      userApi.getAll({
        page: Number(page),
        limit: Number(limit),
        email: emailDebounced,
      }),
  })

  const users = getAllUsersQuery.data?.payload.data || []
  const pagination = getAllUsersQuery.data?.payload.pagination

  const { deleteUserMutation } = useDeleteUser({
    onSuccess: () => {
      setCurrentUserId(null)
      getAllUsersQuery.refetch()
    },
  })

  return (
    <UsersTableContext value={{ currentUser, setCurrentUser, currentUserId, setCurrentUserId }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Người dùng ({pagination?.totalRows || 0})</CardTitle>
          <CardDescription>Dưới đây là danh sách tất cả người dùng đã đăng ký trong hệ thống của bạn.</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setOpenCreate(true)}>
              <PlusCircleIcon />
              Thêm người dùng
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <SearchBox
            placeholder="Tìm kiếm theo email..."
            isLoading={getAllUsersQuery.isLoading}
            classNameWrapper="mb-4 max-w-sm"
            onChange={setEmailSearch}
          />
          <DataTable columns={userColumns} data={users} paginationAPI={pagination} />
        </CardContent>
      </Card>

      {/* Form tạo người dùng */}
      <Dialog open={isOpenCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="min-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Thêm người dùng mới</DialogTitle>
            <DialogDescription>Điền thông tin dưới đây để thêm người dùng mới.</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
            <CreateUserForm onCreateSuccess={() => setOpenCreate(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Form cập nhật người dùng */}
      <Dialog open={!!currentUser} onOpenChange={(value) => !value && setCurrentUser(null)}>
        <DialogContent className="min-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Cập nhật người dùng</DialogTitle>
            <DialogDescription>Điều chỉnh thông tin dưới đây để cập nhật người dùng.</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
            {currentUser && <CreateUserForm userData={currentUser} onUpdateSuccess={() => setCurrentUser(null)} />}
            {!currentUser && <Skeleton className="h-100" />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Xác nhận xóa người dùng */}
      <AlertDialog open={!!currentUserId} onOpenChange={(value) => !value && setCurrentUserId(null)}>
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
              onClick={() => deleteUserMutation.mutate(currentUserId!)}
            >
              {deleteUserMutation.isPending && <Spinner />}
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UsersTableContext>
  )
}
