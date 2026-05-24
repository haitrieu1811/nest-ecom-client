/* eslint-disable @typescript-eslint/no-explicit-any */

import http from '@/lib/http'
import {
  CreateUserBodyType,
  CreateUserResType,
  GetUserResType,
  GetUsersQueryType,
  GetUsersResType,
  UpdateUserBodyType,
  UpdateUserResType,
} from '@/schemas/user.schema'
import { MessageResType, PaginationQueryType } from '@/schemas/utils.schema'

const userApi = {
  sGetAll({ query, accessToken }: { query: PaginationQueryType; accessToken: string }) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetUsersResType>(`/users?${queryString}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  getAll(query: GetUsersQueryType) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetUsersResType>(`/users?${queryString}`)
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
    return http.get<GetUserResType>(`/users/${userId}`)
  },
}

export default userApi
