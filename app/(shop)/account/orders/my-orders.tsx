'use client'

import Link from 'next/link'

import { CalendarClockIcon, ChevronRightIcon, CircleCheckBigIcon, ImageIcon, StoreIcon, TruckIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ORDER_STATUSES = ['chờ xác nhận', 'đã xác nhận', 'đang vận chuyển', 'đã vận chuyển', 'đã hoàn', 'đã hủy'] as const

type OrderStatus = (typeof ORDER_STATUSES)[number]

type OrderItem = {
  id: string
  status: OrderStatus
  createdAt: string
  total: number
  itemCount: number
  paymentMethod: string
  shippingAddress: string
  shop: {
    name: string
  }
  products: {
    id: string
    name: string
    variant: string
    quantity: number
    price: number
  }[]
}

const ORDERS: OrderItem[] = [
  {
    id: 'NE-250531-001',
    status: 'chờ xác nhận',
    createdAt: '31/05/2026 09:15',
    total: 1290000,
    itemCount: 3,
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: '123 Nguyễn Trãi, Q.5, TP. Hồ Chí Minh',
    shop: {
      name: 'NEST Official Store',
    },
    products: [
      {
        id: 'P-001',
        name: 'Áo thun oversize basic',
        variant: 'Trắng / L',
        quantity: 1,
        price: 320000,
      },
      {
        id: 'P-002',
        name: 'Quần jogger thể thao',
        variant: 'Đen / M',
        quantity: 1,
        price: 450000,
      },
      {
        id: 'P-003',
        name: 'Giày sneaker urban',
        variant: '42',
        quantity: 1,
        price: 520000,
      },
    ],
  },
  {
    id: 'NE-250530-098',
    status: 'đã xác nhận',
    createdAt: '30/05/2026 17:42',
    total: 890000,
    itemCount: 2,
    paymentMethod: 'VNPay',
    shippingAddress: '88 Lê Lợi, Q.1, TP. Hồ Chí Minh',
    shop: {
      name: 'Lemon Accessories',
    },
    products: [
      {
        id: 'P-004',
        name: 'Túi đeo chéo mini',
        variant: 'Kem',
        quantity: 1,
        price: 390000,
      },
      {
        id: 'P-005',
        name: 'Mũ lưỡi trai canvas',
        variant: 'Be',
        quantity: 1,
        price: 500000,
      },
    ],
  },
  {
    id: 'NE-250529-074',
    status: 'đang vận chuyển',
    createdAt: '29/05/2026 11:08',
    total: 2450000,
    itemCount: 4,
    paymentMethod: 'Ví điện tử',
    shippingAddress: '15 Trần Hưng Đạo, TP. Hội An, Quảng Nam',
    shop: {
      name: 'Active Wear Hub',
    },
    products: [
      {
        id: 'P-006',
        name: 'Áo khoác gió unisex',
        variant: 'Xanh navy / XL',
        quantity: 1,
        price: 680000,
      },
      {
        id: 'P-007',
        name: 'Quần short training',
        variant: 'Xám / L',
        quantity: 1,
        price: 360000,
      },
      {
        id: 'P-008',
        name: 'Balo thể thao',
        variant: 'Đen',
        quantity: 1,
        price: 620000,
      },
      {
        id: 'P-009',
        name: 'Tất cổ trung',
        variant: 'Free size',
        quantity: 1,
        price: 790000,
      },
    ],
  },
  {
    id: 'NE-250527-061',
    status: 'đã vận chuyển',
    createdAt: '27/05/2026 14:30',
    total: 560000,
    itemCount: 1,
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: '22 Pasteur, Q.3, TP. Hồ Chí Minh',
    shop: {
      name: 'Daily Outfit',
    },
    products: [
      {
        id: 'P-010',
        name: 'Sơ mi linen dài tay',
        variant: 'Xanh nhạt / M',
        quantity: 1,
        price: 560000,
      },
    ],
  },
  {
    id: 'NE-250525-041',
    status: 'đã hoàn',
    createdAt: '25/05/2026 10:05',
    total: 3490000,
    itemCount: 5,
    paymentMethod: 'Thẻ nội địa',
    shippingAddress: '9 Điện Biên Phủ, Q. Bình Thạnh, TP. Hồ Chí Minh',
    shop: {
      name: 'Premium Fashion House',
    },
    products: [
      {
        id: 'P-011',
        name: 'Áo blazer slim fit',
        variant: 'Đen / L',
        quantity: 1,
        price: 1290000,
      },
      {
        id: 'P-012',
        name: 'Quần tây form suông',
        variant: 'Đen / 32',
        quantity: 1,
        price: 850000,
      },
      {
        id: 'P-013',
        name: 'Áo sơ mi formal',
        variant: 'Trắng / L',
        quantity: 1,
        price: 620000,
      },
      {
        id: 'P-014',
        name: 'Cà vạt lụa',
        variant: 'Navy',
        quantity: 1,
        price: 280000,
      },
      {
        id: 'P-015',
        name: 'Thắt lưng da',
        variant: 'Nâu',
        quantity: 1,
        price: 450000,
      },
    ],
  },
  {
    id: 'NE-250524-036',
    status: 'đã hủy',
    createdAt: '24/05/2026 20:12',
    total: 990000,
    itemCount: 2,
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: '32 Võ Văn Tần, Q.3, TP. Hồ Chí Minh',
    shop: {
      name: 'Urban Streetwear',
    },
    products: [
      {
        id: 'P-016',
        name: 'Hoodie basic',
        variant: 'Xám / L',
        quantity: 1,
        price: 620000,
      },
      {
        id: 'P-017',
        name: 'Quần cargo',
        variant: 'Rêu / 31',
        quantity: 1,
        price: 370000,
      },
    ],
  },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  'chờ xác nhận': 'Chờ xác nhận',
  'đã xác nhận': 'Đã xác nhận',
  'đang vận chuyển': 'Đang vận chuyển',
  'đã vận chuyển': 'Đã vận chuyển',
  'đã hoàn': 'Đã hoàn',
  'đã hủy': 'Đã hủy',
}

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  'chờ xác nhận': 'border-amber-300 bg-amber-50 text-amber-700',
  'đã xác nhận': 'border-blue-300 bg-blue-50 text-blue-700',
  'đang vận chuyển': 'border-indigo-300 bg-indigo-50 text-indigo-700',
  'đã vận chuyển': 'border-cyan-300 bg-cyan-50 text-cyan-700',
  'đã hoàn': 'border-emerald-300 bg-emerald-50 text-emerald-700',
  'đã hủy': 'border-red-300 bg-red-50 text-red-700',
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

const getShopInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function MyOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Đơn hàng của tôi</CardTitle>
        <CardDescription>Theo dõi trạng thái đơn hàng và lịch sử mua sắm của bạn.</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={ORDER_STATUSES[0]} className="space-y-4">
          <TabsList variant="line" className="w-full justify-start">
            {ORDER_STATUSES.map((status) => (
              <TabsTrigger key={status} value={status} className="capitalize">
                {STATUS_LABEL[status]}
              </TabsTrigger>
            ))}
          </TabsList>

          {ORDER_STATUSES.map((status) => {
            const ordersByStatus = ORDERS.filter((order) => order.status === status)

            return (
              <TabsContent key={status} value={status} className="space-y-3">
                {ordersByStatus.length === 0 && (
                  <div className="rounded-xl border border-dashed bg-muted/25 p-8 text-center">
                    <p className="text-sm font-medium">Chưa có đơn hàng ở trạng thái này</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Các đơn hàng mới sẽ hiển thị tại đây khi phát sinh.
                    </p>
                  </div>
                )}

                {ordersByStatus.map((order) => (
                  <div
                    key={order.id}
                    className="group rounded-2xl border border-border/80 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                  >
                    {/* Top Row: Shop Info & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="lg" className="ring-2 ring-primary/10">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {getShopInitials(order.shop.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="flex items-center gap-1 text-sm font-bold text-foreground">
                            <StoreIcon className="size-4 text-primary" />
                            {order.shop.name}
                            {order.shop.name.includes('NEST') && (
                              <Badge className="bg-red-500 hover:bg-red-500 text-[10px] text-white px-1.5 py-0 h-4 font-semibold uppercase ml-1">Mall</Badge>
                            )}
                          </p>
                          <span className="text-[11px] text-muted-foreground/80 font-medium">Đối tác chính hãng</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`gap-1 px-2.5 py-0.5 rounded-full font-medium text-xs ${STATUS_BADGE_CLASS[order.status]}`}>
                        {status === 'đã hoàn' ? (
                          <CircleCheckBigIcon className="size-3.5" />
                        ) : status === 'đang vận chuyển' || status === 'đã vận chuyển' ? (
                          <TruckIcon className="size-3.5" />
                        ) : (
                          <CalendarClockIcon className="size-3.5" />
                        )}
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    </div>

                    {/* Middle Row: Product List (Modern layout) */}
                    <div className="space-y-3">
                      {order.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-start justify-between gap-4 p-2 rounded-xl hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                              <ImageIcon className="size-6 text-muted-foreground/60" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground/80">Phân loại: <span className="font-medium text-foreground/80">{product.variant}</span></p>
                              <p className="text-xs text-muted-foreground/60">Số lượng: x{product.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Row: Metadata & Total Price & Actions */}
                    <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground/80">Mã đơn hàng: <span className="font-mono font-semibold text-foreground/80">#{order.id}</span></p>
                        <p className="text-[11px] text-muted-foreground/80">Đặt ngày: <span className="font-medium text-foreground/80">{order.createdAt}</span></p>
                        <p className="text-[11px] text-muted-foreground/80 line-clamp-1">Giao đến: <span className="font-medium text-foreground/80">{order.shippingAddress}</span></p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-muted-foreground">Tổng số tiền ({order.itemCount} sản phẩm):</span>
                          <span className="text-lg font-extrabold text-primary">{formatCurrency(order.total)}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/70 font-medium">
                          Phương thức: {order.paymentMethod}
                        </span>

                        <div className="flex gap-2 mt-1.5">
                          {order.status === 'chờ xác nhận' && (
                            <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl px-4 h-9">
                              Hủy đơn
                            </Button>
                          )}
                          {(order.status === 'đã vận chuyển' || order.status === 'đã hoàn' || order.status === 'đã hủy') && (
                            <Button size="sm" variant="outline" className="text-xs rounded-xl px-4 h-9 border-border/80 hover:bg-muted/70">
                              Mua lại
                            </Button>
                          )}
                          <Button asChild size="sm" variant="outline" className="text-xs rounded-xl px-4 h-9 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary">
                            <Link href={`/account/orders/${order.id}`} className="inline-flex items-center gap-1">
                              Xem chi tiết
                              <ChevronRightIcon className="size-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
