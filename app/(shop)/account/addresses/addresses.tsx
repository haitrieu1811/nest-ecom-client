'use client'

import { useMutation } from '@tanstack/react-query'
import { MapPinIcon, PhoneIcon, PlusCircle, SquarePenIcon, Trash2Icon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import { addressApi } from '@/apis/location.api'
import CreateAddressForm from '@/app/(shop)/_components/create-address-form'
import AlertDialogDestructive from '@/components/alert-dialog-destructive'
import EmptyData from '@/components/empty-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AddressIncludeLocationType } from '@/schemas/address.schema'

export const formatAddress = (address: AddressIncludeLocationType) => {
  return `${address.streetDetail}, ${address.ward.name}, ${address.province.name}`
}

type AddressesProps = { addresses: AddressIncludeLocationType[]; totalAddresses: number }

export default function Addresses({ addresses, totalAddresses }: AddressesProps) {
  const router = useRouter()
  const [isOpenCreate, setIsOpenCreate] = React.useState<boolean>(false)
  const [currentAddress, setCurrentAddress] = React.useState<AddressIncludeLocationType | null>(null)
  const [currentAddressId, setCurrentAddressId] = React.useState<number | null>(null)

  const deleteAddressMutation = useMutation({
    mutationKey: ['delete-address'],
    mutationFn: addressApi.deleteAddress,
    onSuccess: () => {
      toast.success('Địa chỉ đã được xóa')
      setCurrentAddressId(null)
      router.refresh()
    },
  })

  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Sổ địa chỉ ({totalAddresses})</CardTitle>
          <CardDescription>Quản lý địa chỉ giao hàng để thanh toán nhanh hơn.</CardDescription>
          {totalAddresses > 0 && (
            <CardAction>
              <Button size="sm" variant="outline" className="shadow-sm" onClick={() => setIsOpenCreate(true)}>
                <PlusCircle className="size-4" />
                Thêm địa chỉ mới
              </Button>
            </CardAction>
          )}
        </CardHeader>
        {totalAddresses > 0 && (
          <CardContent className="space-y-4 pt-1">
            {addresses.map((address, index) => (
              <div
                key={address.id}
                className="group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/20 hover:shadow-md"
              >
                {address.isDefault && <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-primary/40" />}

                <div className="ml-2 flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Địa chỉ #{String(index + 1).padStart(2, '0')}
                      </span>
                      {address.isDefault && <Badge>Mặc định</Badge>}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-1 font-medium">
                        <UserIcon className="size-3.5" />
                        {address.contactName}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-1 text-muted-foreground">
                        <PhoneIcon className="size-3.5" />
                        {address.phoneNumber}
                      </span>
                    </div>

                    <p className="inline-flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <MapPinIcon className="mt-1 size-3.5 shrink-0" />
                      <span>{formatAddress(address)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setCurrentAddress(address)}
                    >
                      <SquarePenIcon className="size-4" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setCurrentAddressId(address.id)}
                    >
                      <Trash2Icon className="size-4" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
        {totalAddresses === 0 && (
          <CardContent>
            <EmptyData
              Icon={MapPinIcon}
              description="Hãy thêm địa chỉ mới để giao hàng."
              title="Bạn chưa có địa chỉ"
              action={{ label: 'Thêm địa chỉ mới ngay', onClick: () => setIsOpenCreate(true) }}
            />
          </CardContent>
        )}
      </Card>

      {/* Thêm địa chỉ mới */}
      <Dialog open={isOpenCreate} onOpenChange={setIsOpenCreate}>
        <DialogContent className="min-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm địa chỉ mới</DialogTitle>
            <DialogDescription>Thêm địa chỉ mới để giao hàng.</DialogDescription>
          </DialogHeader>
          <CreateAddressForm
            onCreateSuccess={() => {
              setIsOpenCreate(false)
              router.refresh()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Cập nhật địa chỉ */}
      <Dialog open={!!currentAddress} onOpenChange={(value) => !value && setCurrentAddress(null)}>
        <DialogContent className="min-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Cập nhật địa chỉ</DialogTitle>
            <DialogDescription>Cập nhật địa chỉ để giao hàng.</DialogDescription>
          </DialogHeader>
          <CreateAddressForm
            addressData={currentAddress}
            onUpdateSuccess={() => {
              setCurrentAddress(null)
              router.refresh()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Xóa địa chỉ */}
      <AlertDialogDestructive
        open={!!currentAddressId}
        onOpenChange={(open) => !open && setCurrentAddressId(null)}
        onConfirm={() => {
          if (!currentAddressId) return
          deleteAddressMutation.mutate(currentAddressId)
        }}
      />
    </React.Fragment>
  )
}
