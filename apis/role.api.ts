import http from '@/lib/http'
import { GetRolesResType } from '@/schemas/role.schema'

const roleApi = {
  getAll() {
    return http.get<GetRolesResType>('/roles')
  },
}

export default roleApi
