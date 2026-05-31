'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale/vi'
import { TagIcon, Trash2Icon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import brandApi from '@/apis/brand.api'
import BackButton from '@/app/(dashboard)/_components/back-button'
import BrandTranslationsTable from '@/app/(dashboard)/dashboard/brands/[id]/brand-translations-table'
import CreateBrandForm from '@/app/(dashboard)/dashboard/brands/create-brand-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import Loading from '@/components/loading'
import NotFound from '@/components/not-found'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PATH from '@/constants/path'
import useDeleteBrand from '@/hooks/use-delete-brand'

export default function BrandDetail() {
  const router = useRouter()

  const params = useParams<{ id: string }>()
  const brandId = Number(params.id)

  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  const getBrandDetailQuery = useQuery({
    queryKey: ['get-brand-detail', brandId],
    queryFn: () => brandApi.getDetail(brandId),
    enabled: !!brandId,
  })

  const brand = getBrandDetailQuery.data?.payload

  const { deleteBrandMutation } = useDeleteBrand({
    onSuccess: () => {
      router.push(PATH.DASHBOARD_BRANDS)
    },
  })

  return (
    <React.Fragment>
      {brand && !getBrandDetailQuery.isLoading && (
        <div className="space-y-4">
          <BackButton />
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{brand.name}</CardTitle>
              <CardDescription>{brand.description}</CardDescription>
              <CardAction>
                <Button variant="destructive" onClick={() => setIsDeleting(true)}>
                  <Trash2Icon />
                  Xóa thương hiệu
                </Button>
                <AlertDialogDestructive
                  open={isDeleting}
                  onOpenChange={setIsDeleting}
                  title="Xóa thương hiệu?"
                  description="Điều này sẽ xóa vĩnh viễn thương hiệu sản phẩm này. Bạn có chắc chắn muốn tiếp tục?"
                  onConfirm={() => deleteBrandMutation.mutate(brand.id)}
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList variant="line">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="translations">Bản dịch</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <CreateBrandForm brandData={brand} />
                    </div>
                    <div className="col-span-6">
                      <Table>
                        <TableCaption>Thông tin khác về thương hiệu sản phẩm.</TableCaption>
                        <TableBody>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{brand.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Tạo lúc</TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(brand.createdAt), { addSuffix: true, locale: vi })}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Cập nhật lúc</TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(brand.updatedAt), { addSuffix: true, locale: vi })}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="translations" className="mt-4">
                  <BrandTranslationsTable brandTranslations={brand.brandTranslations} brandId={brand.id} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {!brand && !getBrandDetailQuery.isLoading && (
        <NotFound
          icon={TagIcon}
          title="Không tìm thấy thương hiệu"
          description="Thương hiệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          redirect={{
            path: PATH.DASHBOARD_BRANDS,
            text: 'Danh sách thương hiệu',
          }}
        />
      )}

      {getBrandDetailQuery.isLoading && <Loading />}
    </React.Fragment>
  )
}
