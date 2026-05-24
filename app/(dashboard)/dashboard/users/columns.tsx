/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'

import { useUsersTableContext } from '@/app/(dashboard)/dashboard/users/users-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import DataTableColumnHeader from '@/components/ui/data-table-column-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLE_NAME, USER_STATUS } from '@/constants/auth.constant'
import { cn } from '@/lib/utils'
import { GetUsersResType } from '@/schemas/user.schema'
import PATH from '@/constants/path'
import Link from 'next/link'

type User = GetUsersResType['data'][number]

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar || undefined} alt={user.email} />
            <AvatarFallback>{user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{user.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vai trò" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <Badge
          className={cn({
            'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100': user.role.name === ROLE_NAME.ADMIN,
            'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100': user.role.name === ROLE_NAME.MANAGER,
            'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100': user.role.name === ROLE_NAME.SELLER,
            'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100':
              user.role.name === ROLE_NAME.CLIENT,
          })}
        >
          {user.role.name}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <Badge
          className={cn({
            'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100': user.status === USER_STATUS.ACTIVE,
            'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100': user.status === USER_STATUS.BLOCKED,
          })}
        >
          {user.status === USER_STATUS.ACTIVE ? 'Hoạt động' : 'Bị khóa'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tạo lúc" />,
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true, locale: vi }),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => {
      const { setCurrentUser, setCurrentUserId } = useUsersTableContext()
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tao tác</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={PATH.DASHBOARD_USERS_DETAIL(row.original.id)}>Chi tiết</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentUser(row.original)}>Xem nhanh</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentUserId(row.original.id)}>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
