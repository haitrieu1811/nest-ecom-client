import { Metadata } from 'next'
import { cookies } from 'next/headers'

import { addressApi } from '@/apis/location.api'
import Addresses from '@/app/(shop)/account/addresses/addresses'
import { AddressIncludeLocationType } from '@/schemas/address.schema'

export const metadata: Metadata = {
  title: 'Địa chỉ',
  description: 'Quản lý địa chỉ giao hàng của bạn.',
}

export default async function AccountAddressesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  let addresses: AddressIncludeLocationType[] = []
  let totalAddresses: number = 0

  if (accessToken) {
    try {
      const response = await addressApi.sGetAllAddresses(accessToken)
      addresses = response.payload.data
      totalAddresses = response.payload.totalAddresses
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }

  return <Addresses addresses={addresses} totalAddresses={totalAddresses} />
}
