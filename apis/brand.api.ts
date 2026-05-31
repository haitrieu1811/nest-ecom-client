/* eslint-disable @typescript-eslint/no-explicit-any */

import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import http from '@/lib/http'
import {
  CreateBrandTranslationBodyType,
  CreateBrandTranslationResType,
  UpdateBrandTranslationBodyType,
  UpdateBrandTranslationResType,
} from '@/schemas/brand-translation.schema'
import {
  CreateBrandBodyType,
  CreateBrandResType,
  GetBrandResType,
  GetBrandsQueryType,
  GetBrandsResType,
  UpdateBrandBodyType,
  UpdateBrandResType,
} from '@/schemas/brand.schema'
import { MessageResType } from '@/types/utils.type'

const brandApi = {
  getList(query: GetBrandsQueryType = { page: 1, limit: 20 }) {
    const filteredQuery = omitBy(query, isUndefined)
    const queryString = new URLSearchParams(filteredQuery as any).toString()
    return http.get<GetBrandsResType>(`/brands?${queryString}`)
  },

  getDetail(brandId: number) {
    return http.get<GetBrandResType>(`/brands/${brandId}?lang=all`)
  },

  create(body: CreateBrandBodyType) {
    return http.post<CreateBrandResType>('/brands', body)
  },

  update({ body, brandId }: { body: UpdateBrandBodyType; brandId: number }) {
    return http.put<UpdateBrandResType>(`/brands/${brandId}`, body)
  },

  delete(brandId: number) {
    return http.delete<MessageResType>(`/brands/${brandId}`)
  },

  createTranslation(body: CreateBrandTranslationBodyType) {
    return http.post<CreateBrandTranslationResType>('/brand-translations', body)
  },

  updateTranslation({ body, translationId }: { body: UpdateBrandTranslationBodyType; translationId: number }) {
    return http.put<UpdateBrandTranslationResType>(`/brand-translations/${translationId}`, body)
  },

  deleteTranslation(translationId: number) {
    return http.delete<MessageResType>(`/brand-translations/${translationId}`)
  },
}

export default brandApi
