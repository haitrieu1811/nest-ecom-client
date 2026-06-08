/* eslint-disable @typescript-eslint/no-explicit-any */

import http from '@/lib/http'
import {
  CreateProductBodyType,
  CreateProductResType,
  GetManageProductsQueryType,
  GetProductResType,
  GetProductsQueryType,
  GetProductsResType,
  UpdateProductBodyType,
  UpdateProductResType,
} from '@/schemas/product.schema'

export const manageProductApi = {
  create(body: CreateProductBodyType) {
    return http.post<CreateProductResType>('/manage-products', body)
  },

  update({ productId, body }: { productId: number; body: UpdateProductBodyType }) {
    return http.put<UpdateProductResType>(`/manage-products/${productId}`, body)
  },

  delete(productId: number) {
    return http.delete(`/manage-products/${productId}`)
  },

  sGetAll(query: GetManageProductsQueryType, accessToken: string) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetProductsResType>(`/manage-products?${queryString}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  sGetDetail(productId: string, accessToken: string) {
    return http.get<GetProductResType>(`/manage-products/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export const productApi = {
  getList(query?: GetProductsQueryType) {
    const queryString = new URLSearchParams({
      page: String(query?.page ?? 1),
      limit: String(query?.limit ?? 20),
    }).toString()
    return http.get<GetProductsResType>(`/products?${queryString}`)
  },

  sGetList(query: GetProductsQueryType) {
    const queryString = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit),
    }).toString()
    return http.get<GetProductsResType>(`/products?${queryString}`)
  },

  getDetail(productId: string) {
    return http.get<GetProductResType>(`/products/${productId}`)
  },
}
