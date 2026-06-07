'use client'

import React from 'react'

import CreateProductForm from '@/app/(dashboard)/dashboard/products/_create-product-form'
import NotFound from '@/components/not-found'
import { ProductDetailType } from '@/schemas/product.schema'

interface ManageProductDetailProps {
  productData: ProductDetailType | null
}

export default function ManageProductDetail({ productData }: ManageProductDetailProps) {
  return (
    <React.Fragment>
      {productData && <CreateProductForm productData={productData} />}
      {!productData && <NotFound />}
    </React.Fragment>
  )
}
