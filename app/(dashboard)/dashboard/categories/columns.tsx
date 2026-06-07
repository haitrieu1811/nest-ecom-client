/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'

import { useCategoriesTableContext } from '@/app/(dashboard)/dashboard/categories/categories-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import PATH from '@/constants/path'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'
import Link from 'next/link'

export const categoryColumns: ColumnDef<CategoryIncludeTranslationsType>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
    cell: ({ row }) => (
      <Link href={PATH.DASHBOARD_CATEGORIES_DETAIL(row.original.id)} className="flex items-center hover:underline">
        <Avatar>
          <AvatarImage src={row.original.logo || ''} alt={row.original.name} />
          <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="ml-2 font-medium line-clamp-2 break-words max-w-[250px]">{row.original.name}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-[300px] break-words text-muted-foreground">
        {row.original.description || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tạo lúc" />,
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true, locale: vi }),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật lúc" />,
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true, locale: vi }),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => {
      const { setCurrentCategory, setCurrentCategoryId } = useCategoriesTableContext()
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
                <Link href={PATH.DASHBOARD_CATEGORIES_DETAIL(row.original.id)}>Chi tiết</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentCategory(row.original)}>Xem nhanh</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentCategoryId(row.original.id)}>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
