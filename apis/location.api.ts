import http from '@/lib/http'
import {
  GetAddressesResType,
  GetAddressResType,
  UpdateAddressBodyType,
  UpdateAddressResType,
} from '@/schemas/address.schema'
import { CreateAddressBodyType, CreateAddressResType } from '@/schemas/address.schema'
import { GetProvincesResType, GetWardsByProvinceResType } from '@/schemas/location.schema'

export const locationApi = {
  getAllProvinces() {
    return http.get<GetProvincesResType>('/locations/provinces')
  },

  getWardsByProvinceCode(provinceCode: number) {
    return http.get<GetWardsByProvinceResType>(`/locations/provinces/${provinceCode}/wards`)
  },
}

export const addressApi = {
  sGetAllAddresses(accessToken?: string) {
    return http.get<GetAddressesResType>('/addresses', {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    })
  },

  getAddressById(addressId: number) {
    return http.get<GetAddressResType>(`/addresses/${addressId}`)
  },

  createAddress(body: CreateAddressBodyType) {
    return http.post<CreateAddressResType>('/addresses', body)
  },

  updateAddress({ addressId, body }: { addressId: number; body: UpdateAddressBodyType }) {
    return http.put<UpdateAddressResType>(`/addresses/${addressId}`, body)
  },

  deleteAddress(addressId: number) {
    return http.delete(`/addresses/${addressId}`)
  },
}
