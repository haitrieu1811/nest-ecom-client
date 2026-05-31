import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { EllipsisIcon, LanguagesIcon, PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import brandApi from '@/apis/brand.api'
import CreateBrandTranslationForm from '@/app/(dashboard)/dashboard/brands/[id]/create-brand-translation-form'
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
import { BrandTranslationType } from '@/schemas/brand-translation.schema'

type BrandTranslationsTableProps = {
  brandTranslations: BrandTranslationType[]
  brandId: number
}

export default function BrandTranslationsTable({ brandTranslations, brandId }: BrandTranslationsTableProps) {
  const queryClient = useQueryClient()

  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [currentTranslation, setCurrentTranslation] = React.useState<BrandTranslationType | null>(null)
  const [currentTranslationId, setCurrentTranslationId] = React.useState<number | null>(null)

  const deleteBrandTranslationMutation = useMutation({
    mutationKey: ['delete-brand-translation'],
    mutationFn: brandApi.deleteTranslation,
    onSuccess: () => {
      toast.success('Xóa bản dịch thành công')
      setCurrentTranslationId(null)
      queryClient.invalidateQueries({
        queryKey: ['get-brand-detail', brandId],
      })
    },
  })

  const handleDeleteBrandTranslation = () => {
    if (!currentTranslationId) return
    deleteBrandTranslationMutation.mutate(currentTranslationId)
  }

  return (
    <React.Fragment>
      {brandTranslations.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <PlusCircleIcon />
              Thêm bản dịch
            </Button>
          </div>
          <Table>
            <TableCaption>Danh sách bản dịch của thương hiệu này</TableCaption>
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
              {brandTranslations.map((brandTranslation) => (
                <TableRow key={brandTranslation.id}>
                  <TableCell>{brandTranslation.languageId}</TableCell>
                  <TableCell>{brandTranslation.name}</TableCell>
                  <TableCell>{brandTranslation.description}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(brandTranslation.createdAt), { addSuffix: true, locale: vi })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(brandTranslation.updatedAt), { addSuffix: true, locale: vi })}
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
                        <DropdownMenuItem onClick={() => setCurrentTranslation(brandTranslation)}>
                          Xem nhanh
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentTranslationId(brandTranslation.id)}>
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

      {brandTranslations.length === 0 && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LanguagesIcon className="size-4" />
            </EmptyMedia>
            <EmptyTitle>Chưa có bản dịch</EmptyTitle>
            <EmptyDescription>
              Thương hiệu này chưa có bản dịch nào. Hãy thêm bản dịch để hiển thị thông tin thương hiệu bằng nhiều ngôn
              ngữ khác nhau.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              Thêm bản dịch
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm bản dịch</DialogTitle>
            <DialogDescription>
              Thêm bản dịch cho thương hiệu này để hiển thị thông tin bằng nhiều ngôn ngữ khác nhau.
            </DialogDescription>
          </DialogHeader>
          <CreateBrandTranslationForm
            brandId={brandId}
            onCreateSuccess={() => {
              setIsCreating(false)
              queryClient.invalidateQueries({
                queryKey: ['get-brand-detail', brandId],
              })
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!currentTranslation} onOpenChange={(open) => !open && setCurrentTranslation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{currentTranslation?.name || ''}</DialogTitle>
            <DialogDescription>{currentTranslation?.description || ''}</DialogDescription>
          </DialogHeader>
          <CreateBrandTranslationForm
            brandId={brandId}
            brandTranslationData={currentTranslation}
            onUpdateSuccess={() => {
              setCurrentTranslation(null)
              queryClient.invalidateQueries({
                queryKey: ['get-brand-detail', brandId],
              })
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialogDestructive
        open={!!currentTranslationId}
        onOpenChange={(open) => !open && setCurrentTranslationId(null)}
        onConfirm={handleDeleteBrandTranslation}
      />
    </React.Fragment>
  )
}
