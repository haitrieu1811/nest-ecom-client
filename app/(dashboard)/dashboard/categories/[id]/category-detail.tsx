'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale/vi'
import { TagsIcon, Trash2Icon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import categoryApi from '@/apis/category.api'
import BackButton from '@/app/(dashboard)/_components/back-button'
import CategoryTranslationsTable from '@/app/(dashboard)/dashboard/categories/[id]/category-translations-table'
import SubCategoriesTable from '@/app/(dashboard)/dashboard/categories/[id]/sub-categories-table'
import CreateCategoryForm from '@/app/(dashboard)/dashboard/categories/create-category-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import Loading from '@/components/loading'
import NotFound from '@/components/not-found'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PATH from '@/constants/path'
import useDeleteCategory from '@/hooks/use-delete-category'

export default function CategoryDetail() {
  const router = useRouter()

  const params = useParams<{ id: string }>()
  const categoryId = Number(params.id)

  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  const getCategoryDetailQuery = useQuery({
    queryKey: ['get-category-detail', categoryId],
    queryFn: () => categoryApi.getDetail(categoryId),
    enabled: !!categoryId,
  })

  const category = getCategoryDetailQuery.data?.payload

  const { deleteCategoryMutation } = useDeleteCategory({
    onSuccess: () => {
      router.push(PATH.DASHBOARD_CATEGORIES)
    },
  })

  return (
    <React.Fragment>
      {/* Hiển thị thông tin danh mục */}
      {category && !getCategoryDetailQuery.isLoading && (
        <div className="space-y-4">
          <BackButton />
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                <span>{category.name}</span>
                <Badge variant="outline" className="ml-2">
                  {category.parentId ? 'Danh mục con' : 'Danh mục gốc'}
                </Badge>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
              <CardAction>
                {/* Xóa danh mục */}
                <Button variant="destructive" onClick={() => setIsDeleting(true)}>
                  <Trash2Icon />
                  Xóa danh mục
                </Button>
                <AlertDialogDestructive
                  open={isDeleting}
                  onOpenChange={setIsDeleting}
                  title="Xóa danh mục?"
                  description="Điều này sẽ xóa vĩnh viễn danh mục sản phẩm này. Bạn có chắc chắn muốn tiếp tục?"
                  onConfirm={() => deleteCategoryMutation.mutate(category.id)}
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList variant="line">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  {category.parentId === null && <TabsTrigger value="sub-categories">Danh mục con</TabsTrigger>}
                  <TabsTrigger value="translations">Bản dịch</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <CreateCategoryForm categoryData={category} />
                    </div>
                    <div className="col-span-6">
                      <Table>
                        <TableCaption>Thông tin khác về danh mục sản phẩm.</TableCaption>
                        <TableBody>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{category.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Tạo lúc</TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(category.createdAt), { addSuffix: true, locale: vi })}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Cập nhật lúc</TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true, locale: vi })}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
                {category.parentId === null && (
                  <TabsContent value="sub-categories" className="mt-4">
                    <SubCategoriesTable parentId={category.id} />
                  </TabsContent>
                )}
                <TabsContent value="translations" className="mt-4">
                  <CategoryTranslationsTable
                    categoryTranslations={category.categoryTranslations}
                    categoryId={category.id}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Không tìm thấy danh mục */}
      {!category && !getCategoryDetailQuery.isLoading && (
        <NotFound
          icon={TagsIcon}
          title="Không tìm thấy danh mục sản phẩm"
          description="Danh mục sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          redirect={{
            path: PATH.DASHBOARD_CATEGORIES,
            text: 'Danh sách danh mục',
          }}
        />
      )}

      {/* Đang tải dữ liệu */}
      {getCategoryDetailQuery.isLoading && <Loading />}
    </React.Fragment>
  )
}
