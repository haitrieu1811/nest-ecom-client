'use client'

import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale/vi'
import { EllipsisIcon, PlusCircleIcon, TagsIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import CreateCategoryForm from '@/app/(dashboard)/dashboard/categories/create-category-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import useCategories from '@/hooks/use-categories'
import useDeleteCategory from '@/hooks/use-delete-category'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'

type SubCategoriesTableProps = {
  parentId: number
}

export default function SubCategoriesTable({ parentId }: SubCategoriesTableProps) {
  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [currentSubCategory, setCurrentSubCategory] = React.useState<CategoryIncludeTranslationsType | null>(null)
  const [currentSubCategoryId, setCurrentSubCategoryId] = React.useState<number | null>(null)

  const {
    categories: subCategories,
    totalCategories,
    getCategoriesQuery,
  } = useCategories({
    query: {
      parentId,
    },
  })

  const { deleteCategoryMutation } = useDeleteCategory({
    onSuccess: () => {
      setCurrentSubCategoryId(null)
      getCategoriesQuery.refetch()
    },
  })

  const handleDeleteSubCategory = () => {
    if (!currentSubCategoryId) return
    deleteCategoryMutation.mutate(currentSubCategoryId)
  }

  return (
    <React.Fragment>
      {/* Danh sách */}
      {totalCategories > 0 && !getCategoriesQuery.isLoading && (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <PlusCircleIcon />
              Thêm danh mục con
            </Button>
          </div>
          <Table>
            <TableCaption>Danh sách danh mục con của danh mục này</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Tạo lúc</TableHead>
                <TableHead>Cập nhật lúc</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell>{subCategory.id}</TableCell>
                  <TableCell>{subCategory.name}</TableCell>
                  <TableCell>{subCategory.description}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(subCategory.createdAt), { addSuffix: true, locale: vi })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(subCategory.updatedAt), { addSuffix: true, locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={PATH.DASHBOARD_CATEGORIES_DETAIL(subCategory.id)}>Chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentSubCategory(subCategory)}>
                          Xem nhanh
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentSubCategoryId(subCategory.id)}>Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Chưa có danh mục con nào */}
      {totalCategories === 0 && !getCategoriesQuery.isLoading && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TagsIcon className="size-4s" />
            </EmptyMedia>
            <EmptyTitle>Danh mục con trống</EmptyTitle>
            <EmptyDescription>Danh mục con của danh mục này hiện tại chưa có.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              Thêm danh mục con
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {/* Thêm danh mục con */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm danh mục con</DialogTitle>
          </DialogHeader>
          <CreateCategoryForm
            createWithParentId={parentId}
            onCreateSuccess={() => {
              setIsCreating(false)
              getCategoriesQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Cập nhật danh mục con */}
      <Dialog open={!!currentSubCategory} onOpenChange={(open) => !open && setCurrentSubCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{currentSubCategory?.name || ''}</DialogTitle>
          </DialogHeader>
          <CreateCategoryForm
            categoryData={currentSubCategory}
            onUpdateSuccess={() => {
              setCurrentSubCategory(null)
              getCategoriesQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Xác nhận xóa danh mục con */}
      <AlertDialogDestructive
        open={!!currentSubCategoryId}
        onOpenChange={(open) => !open && setCurrentSubCategoryId(null)}
        title="Xóa danh mục con?"
        description="Hành động này sẽ xóa vĩnh viễn danh mục con này. Hãy chắc chắn rằng bạn muốn tiếp tục."
        onConfirm={handleDeleteSubCategory}
      />
    </React.Fragment>
  )
}
