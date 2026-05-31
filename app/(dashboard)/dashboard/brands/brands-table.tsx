'use client'

import { PlusCircle } from 'lucide-react'
import React from 'react'

import { brandColumns } from '@/app/(dashboard)/dashboard/brands/columns'
import CreateBrandForm from '@/app/(dashboard)/dashboard/brands/create-brand-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useBrands from '@/hooks/use-brands'
import useDeleteBrand from '@/hooks/use-delete-brand'
import { BrandIncludeTranslationsType } from '@/schemas/brand.schema'

type BrandsTableContextType = {
  currentBrandId: number | null
  currentBrand: BrandIncludeTranslationsType | null
  setCurrentBrandId: React.Dispatch<React.SetStateAction<number | null>>
  setCurrentBrand: React.Dispatch<React.SetStateAction<BrandIncludeTranslationsType | null>>
}

const BrandsTableContext = React.createContext<BrandsTableContextType>({
  currentBrandId: null,
  currentBrand: null,
  setCurrentBrandId: () => {},
  setCurrentBrand: () => {},
})

export const useBrandsTableContext = () => React.useContext(BrandsTableContext)

export default function BrandsTable() {
  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [currentBrandId, setCurrentBrandId] = React.useState<number | null>(null)
  const [currentBrand, setCurrentBrand] = React.useState<BrandIncludeTranslationsType | null>(null)

  const { brands, totalBrands, getBrandsQuery } = useBrands()
  const { deleteBrandMutation } = useDeleteBrand({
    onSuccess: () => {
      setCurrentBrandId(null)
      getBrandsQuery.refetch()
    },
  })

  const handleDeleteBrand = () => {
    if (!currentBrandId) return
    deleteBrandMutation.mutate(currentBrandId)
  }

  return (
    <BrandsTableContext value={{ currentBrandId, currentBrand, setCurrentBrandId, setCurrentBrand }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thương hiệu ({totalBrands})</CardTitle>
          <CardDescription>Quản lý thương hiệu sản phẩm.</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <PlusCircle />
              Thêm thương hiệu mới
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={brandColumns} data={brands} />
        </CardContent>
      </Card>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm thương hiệu mới</DialogTitle>
            <DialogDescription>Điền thông tin để tạo thương hiệu sản phẩm mới.</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
            <CreateBrandForm
              onCreateSuccess={() => {
                setIsCreating(false)
                getBrandsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!currentBrand} onOpenChange={(open) => !open && setCurrentBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{currentBrand?.name || ''}</DialogTitle>
            <DialogDescription>{currentBrand?.description || ''}</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
            <CreateBrandForm
              brandData={currentBrand}
              onUpdateSuccess={() => {
                setCurrentBrand(null)
                getBrandsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialogDestructive
        open={!!currentBrandId}
        onOpenChange={(open) => !open && setCurrentBrandId(null)}
        title="Xóa thương hiệu"
        description="Bạn có chắc chắn muốn xóa thương hiệu này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteBrand}
      />
    </BrandsTableContext>
  )
}
