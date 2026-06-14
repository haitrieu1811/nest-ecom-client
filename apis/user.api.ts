/* eslint-disable @typescript-eslint/no-explicit-any */

import http from '@/lib/http'
import {
  CreateUserBodyType,
  CreateUserResType,
  GetListSellersResType,
  GetListUsersQueryType,
  GetListUsersResType,
  GetSellerDetailResType,
  GetUserDetailResType,
  UpdateUserBodyType,
  UpdateUserResType,
} from '@/schemas/user.schema'
import { MessageResType, PaginationQueryType } from '@/schemas/utils.schema'

export const userApi = {
  getSellers(query: GetListUsersQueryType) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetListSellersResType>(`/users/sellers?${queryString}`)
  },

  getSellerDetail(userId: number) {
    return http.get<GetSellerDetailResType>(`/users/sellers/${userId}`)
  },
}

export const manageUserApi = {
  sGetAll({ query, accessToken }: { query: PaginationQueryType; accessToken: string }) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetListUsersResType>(`/manage-user?${queryString}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  getAll(query: GetListUsersQueryType) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetListUsersResType>(`/manage-user?${queryString}`)
  },

  create(body: CreateUserBodyType) {
    return http.post<CreateUserResType>('/manage-user', body)
  },

  update({ userId, body }: { userId: number; body: UpdateUserBodyType }) {
    return http.put<UpdateUserResType>(`/manage-user/${userId}`, body)
  },

  delete(userId: number) {
    return http.delete<MessageResType>(`/manage-user/${userId}`)
  },

  getDetail(userId: number) {
    return http.get<GetUserDetailResType>(`/manage-user/${userId}`)
  },
}
