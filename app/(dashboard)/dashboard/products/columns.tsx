'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

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
import { ProductIncludeTranslationsType } from '@/schemas/product.schema'

export const productColumns: ColumnDef<ProductIncludeTranslationsType>[] = [
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
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={product.thumbnail || undefined} alt={product.name} />
            <AvatarFallback>{product.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Link href={PATH.DASHBOARD_PRODUCTS_DETAIL(product.id)}>{product.name}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'publishedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian công bố" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.publishedAt
          ? formatDistanceToNow(new Date(row.original.publishedAt), { addSuffix: true, locale: vi })
          : '—'}
      </span>
    ),
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true, locale: vi }),
  },

  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật" />,
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true, locale: vi }),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => {
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
                <Link href={PATH.DASHBOARD_PRODUCTS_DETAIL(row.original.id)}>Chi tiết</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Xem nhanh</DropdownMenuItem>
              <DropdownMenuItem>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
