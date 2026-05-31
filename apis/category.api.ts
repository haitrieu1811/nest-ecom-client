/* eslint-disable @typescript-eslint/no-explicit-any */

import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import http from '@/lib/http'
import {
  CreateCategoryTranslationBodyType,
  CreateCategoryTranslationResType,
  UpdateCategoryTranslationBodyType,
  UpdateCategoryTranslationResType,
} from '@/schemas/category-translation.schema'
import {
  CreateCategoryBodyType,
  CreateCategoryResType,
  GetCategoriesQueryType,
  GetCategoriesResType,
  GetCategoryResType,
  UpdateCategoryBodyType,
  UpdateCategoryResType,
} from '@/schemas/category.schema'
import { MessageResType } from '@/types/utils.type'

const categoryApi = {
  getList(query: GetCategoriesQueryType = { page: 1, limit: 20, parentId: undefined }) {
    const filteredQuery = omitBy(query, isUndefined)
    const queryString = new URLSearchParams(filteredQuery as any).toString()
    return http.get<GetCategoriesResType>(`/categories?${queryString}`)
  },

  getDetail(categoryId: number) {
    return http.get<GetCategoryResType>(`/categories/${categoryId}`)
  },

  create(body: CreateCategoryBodyType) {
    return http.post<CreateCategoryResType>('/categories', body)
  },

  update({ body, categoryId }: { body: UpdateCategoryBodyType; categoryId: number }) {
    return http.put<UpdateCategoryResType>(`/categories/${categoryId}`, body)
  },

  delete(categoryId: number) {
    return http.delete<MessageResType>(`/categories/${categoryId}`)
  },

  createTranslation(body: CreateCategoryTranslationBodyType) {
    return http.post<CreateCategoryTranslationResType>('/category-translations', body)
  },

  updateTranslation({ body, translationId }: { body: UpdateCategoryTranslationBodyType; translationId: number }) {
    return http.put<UpdateCategoryTranslationResType>(`/category-translations/${translationId}`, body)
  },

  deleteTranslation(translationId: number) {
    return http.delete<MessageResType>(`/category-translations/${translationId}`)
  },
}

export default categoryApi
