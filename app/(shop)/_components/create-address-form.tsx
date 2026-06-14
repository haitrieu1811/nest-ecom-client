/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { addressApi, locationApi } from '@/apis/location.api'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn, handleErrorFromAPI } from '@/lib/utils'
import {
  AddressIncludeLocationType,
  CreateAddressBodySchema,
  CreateAddressBodyType,
  CreateAddressResType,
  UpdateAddressResType,
} from '@/schemas/address.schema'

// Helper function to remove Vietnamese diacritics for accent-insensitive search
const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

// Custom cmdk filter to match both with and without Vietnamese accents
const customFilter = (value: string, search: string) => {
  const normalizedValue = removeAccents(value).toLowerCase()
  const normalizedSearch = removeAccents(search).toLowerCase()
  return normalizedValue.includes(normalizedSearch) ? 1 : 0
}

type CreateAddressFormProps = {
  className?: string
  addressData?: AddressIncludeLocationType | null
  onCreateSuccess?: (payload: CreateAddressResType) => void
  onUpdateSuccess?: (payload: UpdateAddressResType) => void
  onCancel?: () => void
}

export default function CreateAddressForm({
  addressData,
  className,
  onCreateSuccess,
  onUpdateSuccess,
  onCancel,
}: CreateAddressFormProps) {
  const [openProvince, setOpenProvince] = React.useState(false)
  const [openWard, setOpenWard] = React.useState(false)

  // Fetch provinces
  const getProvincesQuery = useQuery({
    queryKey: ['get-all-provinces'],
    queryFn: () => locationApi.getAllProvinces(),
  })
  const provinces = getProvincesQuery.data?.payload.data || []

  const form = useForm<CreateAddressBodyType>({
    resolver: zodResolver(CreateAddressBodySchema),
    defaultValues: {
      contactName: '',
      phoneNumber: '',
      streetDetail: '',
      isDefault: false,
      provinceCode: undefined,
      wardCode: undefined,
    },
  })

  React.useEffect(() => {
    if (!addressData) return
    form.reset({
      contactName: addressData.contactName,
      phoneNumber: addressData.phoneNumber,
      streetDetail: addressData.streetDetail,
      isDefault: addressData.isDefault,
      provinceCode: addressData.provinceCode,
      wardCode: addressData.wardCode,
    })
  }, [addressData, form])

  const provinceCode = form.watch('provinceCode')

  // Fetch wards based on selected province code
  const getWardsQuery = useQuery({
    queryKey: ['wards', provinceCode],
    queryFn: () => locationApi.getWardsByProvinceCode(provinceCode),
    enabled: !!provinceCode,
  })
  const wards = getWardsQuery.data?.payload.data || []

  const createAddressMutation = useMutation({
    mutationKey: ['create-address'],
    mutationFn: addressApi.createAddress,
    onSuccess: (data) => {
      toast.success('Thêm địa chỉ mới thành công!')
      form.reset()
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateAddressMutation = useMutation({
    mutationKey: ['update-address'],
    mutationFn: addressApi.updateAddress,
    onSuccess: (data) => {
      toast.success('Cập nhật địa chỉ thành công!')
      form.reset()
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const isPending = createAddressMutation.isPending || updateAddressMutation.isPending

  const onSubmit = form.handleSubmit((data) => {
    if (isPending) return
    if (addressData) {
      return updateAddressMutation.mutate({ addressId: addressData.id, body: data })
    }
    createAddressMutation.mutate(data)
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        {/* Họ và tên */}
        <Controller
          control={form.control}
          name="contactName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contactName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Họ và tên người nhận
              </FieldLabel>
              <Input {...field} id="contactName" placeholder="Nhập họ và tên" disabled={isPending} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Số điện thoại */}
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phoneNumber" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Số điện thoại
              </FieldLabel>
              <Input {...field} id="phoneNumber" placeholder="Nhập số điện thoại" disabled={isPending} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        {/* Tỉnh/Thành phố */}
        <Controller
          control={form.control}
          name="provinceCode"
          render={({ field, fieldState }) => {
            const selectedProvince = provinces.find((p) => p.code === field.value)
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tỉnh / Thành phố
                </FieldLabel>
                <Popover open={openProvince} onOpenChange={setOpenProvince}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProvince}
                      className="w-full justify-between"
                      disabled={isPending || getProvincesQuery.isLoading}
                    >
                      <span className="truncate">
                        {selectedProvince ? selectedProvince.name : 'Chọn Tỉnh / Thành phố'}
                      </span>
                      {getProvincesQuery.isLoading ? (
                        <Spinner className="size-4 opacity-50" />
                      ) : (
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0 z-50 shadow-md border border-border"
                    align="start"
                  >
                    <Command className="w-full" filter={customFilter}>
                      <CommandInput placeholder="Tìm kiếm Tỉnh/Thành phố..." />
                      <CommandList>
                        {getProvincesQuery.isLoading ? (
                          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground select-none">
                            <Spinner />
                            Đang tải...
                          </div>
                        ) : provinces.length === 0 ? (
                          <CommandEmpty>Không tìm thấy Tỉnh/Thành phố nào.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {provinces.map((province) => (
                              <CommandItem
                                key={province.code}
                                value={province.name}
                                data-checked={field.value === province.code ? 'true' : 'false'}
                                onSelect={() => {
                                  field.onChange(province.code)
                                  form.setValue('wardCode', undefined as any, { shouldValidate: true })
                                  setOpenProvince(false)
                                }}
                                className="cursor-pointer"
                              >
                                {province.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        {/* Phường/Xã */}
        <Controller
          control={form.control}
          name="wardCode"
          render={({ field, fieldState }) => {
            const selectedWard = wards.find((w) => w.code === field.value)
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phường / Xã
                </FieldLabel>
                <Popover open={openWard} onOpenChange={setOpenWard}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openWard}
                      className="w-full justify-between"
                      disabled={isPending || !provinceCode || getWardsQuery.isLoading}
                    >
                      <span className="truncate">{selectedWard ? selectedWard.name : 'Chọn Phường / Xã'}</span>
                      {getWardsQuery.isLoading ? (
                        <Spinner className="size-4 opacity-50" />
                      ) : (
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0 z-50 shadow-md border border-border"
                    align="start"
                  >
                    <Command className="w-full" filter={customFilter}>
                      <CommandInput placeholder="Tìm kiếm Phường/Xã..." />
                      <CommandList>
                        {getWardsQuery.isLoading ? (
                          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground select-none">
                            <Spinner />
                            Đang tải...
                          </div>
                        ) : wards.length === 0 ? (
                          <CommandEmpty>Không tìm thấy Phường/Xã nào.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {wards.map((ward) => (
                              <CommandItem
                                key={ward.code}
                                value={ward.name}
                                data-checked={field.value === ward.code ? 'true' : 'false'}
                                onSelect={() => {
                                  field.onChange(ward.code)
                                  setOpenWard(false)
                                }}
                                className="cursor-pointer"
                              >
                                {ward.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      {/* Địa chỉ cụ thể */}
      <Controller
        control={form.control}
        name="streetDetail"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="streetDetail" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Địa chỉ cụ thể
            </FieldLabel>
            <Textarea {...field} id="streetDetail" placeholder="Số nhà, tên đường, tòa nhà,..." disabled={isPending} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Đặt làm mặc định */}
      <Controller
        control={form.control}
        name="isDefault"
        render={({ field }) => (
          <div className="flex items-center gap-3 py-1">
            <Switch id="isDefault" checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
            <FieldLabel
              htmlFor="isDefault"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 select-none cursor-pointer"
            >
              Đặt làm địa chỉ mặc định
            </FieldLabel>
          </div>
        )}
      />

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner className="mr-1.5" />}
          {addressData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
        </Button>
      </div>
    </form>
  )
}
