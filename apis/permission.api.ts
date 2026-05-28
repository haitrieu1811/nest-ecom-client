import http from '@/lib/http'
import { GetPermissionsResType, UpdatePermissionBodyType, UpdatePermissionResType } from '@/schemas/permission.schema'

const permissionApi = {
  getAll() {
    return http.get<GetPermissionsResType>('/permissions')
  },

  update({ permissionId, body }: { permissionId: number; body: UpdatePermissionBodyType }) {
    return http.put<UpdatePermissionResType>(`/permissions/${permissionId}`, body)
  },
}

export default permissionApi
