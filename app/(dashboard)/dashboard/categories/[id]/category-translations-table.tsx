import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale'
import { EllipsisIcon, LanguagesIcon, PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import categoryApi from '@/apis/category.api'
import CreateCategoryTranslationForm from '@/app/(dashboard)/dashboard/categories/[id]/create-category-translation-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CategoryTranslationType } from '@/schemas/category-translation.schema'

type CategoryTranslationsTableProps = {
  categoryTranslations: CategoryTranslationType[]
  categoryId: number
}

export default function CategoryTranslationsTable({
  categoryTranslations,
  categoryId,
}: CategoryTranslationsTableProps) {
  const queryClient = useQueryClient()

  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [currentTranslation, setCurrentTranslation] = React.useState<CategoryTranslationType | null>(null)
  const [currentTranslationId, setCurrentTranslationId] = React.useState<number | null>(null)

  const deleteCategoryTranslationMutation = useMutation({
    mutationKey: ['delete-category-translation'],
    mutationFn: categoryApi.deleteTranslation,
    onSuccess: () => {
      toast.success('Xóa bản dịch thành công')
      setCurrentTranslationId(null)
      queryClient.invalidateQueries({
        queryKey: ['get-category-detail', categoryId],
      })
    },
  })

  const handleDeleteCategoryTranslation = () => {
    if (!currentTranslationId) return
    deleteCategoryTranslationMutation.mutate(currentTranslationId)
  }

  return (
    <React.Fragment>
      {/* Danh sách bản dịch */}
      {categoryTranslations.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <PlusCircleIcon />
              Thêm bản dịch
            </Button>
          </div>
          <Table>
            <TableCaption>Danh sách bản dịch của danh mục này</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Ngôn ngữ</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Tạo lúc</TableHead>
                <TableHead>Cập nhật lúc</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryTranslations.map((categoryTranslation) => (
                <TableRow key={categoryTranslation.id}>
                  <TableCell>{categoryTranslation.languageId}</TableCell>
                  <TableCell>{categoryTranslation.name}</TableCell>
                  <TableCell>{categoryTranslation.description}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(categoryTranslation.createdAt), { addSuffix: true, locale: vi })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(categoryTranslation.updatedAt), { addSuffix: true, locale: vi })}
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
                        <DropdownMenuItem onClick={() => setCurrentTranslation(categoryTranslation)}>
                          Xem nhanh
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentTranslationId(categoryTranslation.id)}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Chưa có bản dịch nào */}
      {categoryTranslations.length === 0 && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LanguagesIcon className="size-4" />
            </EmptyMedia>
            <EmptyTitle>Chưa có bản dịch</EmptyTitle>
            <EmptyDescription>
              Danh mục này chưa có bản dịch nào. Hãy thêm bản dịch để hiển thị thông tin danh mục bằng nhiều ngôn ngữ
              khác nhau.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              Thêm bản dịch
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {/* Thêm bản dịch */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm bản dịch</DialogTitle>
            <DialogDescription>
              Thêm bản dịch cho danh mục này để hiển thị thông tin bằng nhiều ngôn ngữ khác nhau.
            </DialogDescription>
          </DialogHeader>
          <CreateCategoryTranslationForm
            categoryId={categoryId}
            onCreateSuccess={() => {
              setIsCreating(false)
              queryClient.invalidateQueries({
                queryKey: ['get-category-detail', categoryId],
              })
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Cập nhật bản dịch */}
      <Dialog open={!!currentTranslation} onOpenChange={(open) => !open && setCurrentTranslation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{currentTranslation?.name || ''}</DialogTitle>
            <DialogDescription>{currentTranslation?.description || ''}</DialogDescription>
          </DialogHeader>
          <CreateCategoryTranslationForm
            categoryId={categoryId}
            categoryTranslationData={currentTranslation}
            onUpdateSuccess={() => {
              setCurrentTranslation(null)
              queryClient.invalidateQueries({
                queryKey: ['get-category-detail', categoryId],
              })
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Xác nhận xóa bản dịch */}
      <AlertDialogDestructive
        open={!!currentTranslationId}
        onOpenChange={(open) => !open && setCurrentTranslationId(null)}
        onConfirm={handleDeleteCategoryTranslation}
      />
    </React.Fragment>
  )
}
