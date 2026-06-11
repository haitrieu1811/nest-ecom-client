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

const userApi = {
  sGetAll({ query, accessToken }: { query: PaginationQueryType; accessToken: string }) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetListUsersResType>(`/users?${queryString}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  getAll(query: GetListUsersQueryType) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetListUsersResType>(`/users?${queryString}`)
  },

  create(body: CreateUserBodyType) {
    return http.post<CreateUserResType>('/users', body)
  },

  update({ userId, body }: { userId: number; body: UpdateUserBodyType }) {
    return http.put<UpdateUserResType>(`/users/${userId}`, body)
  },

  delete(userId: number) {
    return http.delete<MessageResType>(`/users/${userId}`)
  },

  getDetail(userId: number) {
    return http.get<GetUserDetailResType>(`/users/${userId}`)
  },

  getSellers(query: GetListUsersQueryType) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetListSellersResType>(`/users/sellers?${queryString}`)
  },

  getSellerDetail(userId: number) {
    return http.get<GetSellerDetailResType>(`/users/sellers/${userId}`)
  },
}

export default userApi
