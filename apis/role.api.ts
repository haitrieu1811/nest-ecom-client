/* eslint-disable @typescript-eslint/no-explicit-any */

import http from '@/lib/http'
import {
  CreateRoleBodyType,
  CreateRoleResType,
  GetRoleResType,
  GetRolesResType,
  UpdateRoleBodyType,
  UpdateRoleResType,
} from '@/schemas/role.schema'
import { PaginationQueryType } from '@/schemas/utils.schema'
import { MessageResType } from '@/types/utils.type'

const roleApi = {
  getAll(query: PaginationQueryType) {
    const queryString = new URLSearchParams(query as any).toString()
    return http.get<GetRolesResType>(`/roles?${queryString}`)
  },

  getDetail(roleId: number) {
    return http.get<GetRoleResType>(`/roles/${roleId}`)
  },

  create(body: CreateRoleBodyType) {
    return http.post<CreateRoleResType>('/roles', body)
  },

  update({ roleId, body }: { roleId: number; body: UpdateRoleBodyType }) {
    return http.put<UpdateRoleResType>(`/roles/${roleId}`, body)
  },

  delete(roleId: number) {
    return http.delete<MessageResType>(`/roles/${roleId}`)
  },
}

export default roleApi
