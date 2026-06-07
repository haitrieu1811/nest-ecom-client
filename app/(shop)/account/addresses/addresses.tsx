import { MapPinIcon, PhoneIcon, PlusCircle, SquarePenIcon, Trash2Icon, UserIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ADDRESS_ITEMS = [
  {
    id: 1,
    recipient: 'Nguyen Van A',
    phone: '0901 234 567',
    address: '123 Nguyen Trai, Phuong 2, Quan 5, TP. Ho Chi Minh',
    isDefault: true,
  },
  {
    id: 2,
    recipient: 'Nguyen Van A',
    phone: '0901 234 567',
    address: '88 Le Loi, Phuong Ben Nghe, Quan 1, TP. Ho Chi Minh',
    isDefault: false,
  },
  {
    id: 3,
    recipient: 'Nguyen Van A',
    phone: '0901 234 567',
    address: '15 Tran Hung Dao, Phuong Minh An, TP. Hoi An, Quang Nam',
    isDefault: false,
  },
] as const

export default function Addresses() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Sổ địa chỉ</CardTitle>
        <CardDescription>Quản lý địa chỉ giao hàng để thanh toán nhanh hơn.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline" className="shadow-sm">
            <PlusCircle className="size-4" />
            Tạo địa chỉ mới
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {ADDRESS_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/20 hover:shadow-md"
          >
            {item.isDefault && <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-primary/40" />}

            <div className="ml-2 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Địa chỉ #{String(index + 1).padStart(2, '0')}
                  </span>
                  {item.isDefault && <Badge>Mặc định</Badge>}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-1 font-medium">
                    <UserIcon className="size-3.5" />
                    {item.recipient}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-1 text-muted-foreground">
                    <PhoneIcon className="size-3.5" />
                    {item.phone}
                  </span>
                </div>

                <p className="inline-flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <MapPinIcon className="mt-1 size-3.5 shrink-0" />
                  <span>{item.address}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" className="rounded-full">
                  <SquarePenIcon className="size-4" />
                  Chỉnh sửa
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2Icon className="size-4" />
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
