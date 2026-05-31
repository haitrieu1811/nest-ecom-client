'use client'

import { PlusCircle } from 'lucide-react'
import React from 'react'

import { categoryColumns } from '@/app/(dashboard)/dashboard/categories/columns'
import CreateCategoryForm from '@/app/(dashboard)/dashboard/categories/create-category-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useCategories from '@/hooks/use-categories'
import useDeleteCategory from '@/hooks/use-delete-category'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'

type CategoriesTableContext = {
  currentCategoryId: number | null
  currentCategory: CategoryIncludeTranslationsType | null
  setCurrentCategoryId: React.Dispatch<React.SetStateAction<number | null>>
  setCurrentCategory: React.Dispatch<React.SetStateAction<CategoryIncludeTranslationsType | null>>
}

const CategoriesTableContext = React.createContext<CategoriesTableContext>({
  currentCategoryId: null,
  currentCategory: null,
  setCurrentCategoryId: () => {},
  setCurrentCategory: () => {},
})

export const useCategoriesTableContext = () => React.useContext(CategoriesTableContext)

export default function CategoriesTable() {
  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [currentCategoryId, setCurrentCategoryId] = React.useState<number | null>(null)
  const [currentCategory, setCurrentCategory] = React.useState<CategoryIncludeTranslationsType | null>(null)

  const { categories: rootCategories, totalCategories, getCategoriesQuery } = useCategories()
  const { deleteCategoryMutation } = useDeleteCategory({
    onSuccess: () => {
      setCurrentCategoryId(null)
      getCategoriesQuery.refetch()
    },
  })

  const handleDeleteCategory = () => {
    if (!currentCategoryId) return
    deleteCategoryMutation.mutate(currentCategoryId)
  }

  return (
    <CategoriesTableContext
      value={{
        currentCategoryId,
        currentCategory,
        setCurrentCategoryId,
        setCurrentCategory,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Danh mục sản phẩm ({totalCategories})</CardTitle>
          <CardDescription>Quản lý danh mục sản phẩm.</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <PlusCircle />
              Thêm danh mục mới
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={categoryColumns} data={rootCategories} />
        </CardContent>
      </Card>

      {/* Thêm danh mục mới */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm danh mục mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo danh mục mới. Bạn có thể tạo danh mục cấp 1 hoặc cấp 2.
            </DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
            <CreateCategoryForm
              onCreateSuccess={() => {
                setIsCreating(false)
                getCategoriesQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cập nhật danh mục */}
      <Dialog open={!!currentCategory} onOpenChange={(open) => !open && setCurrentCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{currentCategory?.name || ''}</DialogTitle>
            <DialogDescription>{currentCategory?.description || ''}</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
            <CreateCategoryForm
              categoryData={currentCategory}
              onUpdateSuccess={() => {
                setCurrentCategory(null)
                getCategoriesQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Xóa danh mục */}
      <AlertDialogDestructive
        open={!!currentCategoryId}
        onOpenChange={(open) => !open && setCurrentCategoryId(null)}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteCategory}
      />
    </CategoriesTableContext>
  )
}
