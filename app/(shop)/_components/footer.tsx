'use client'

import Link from 'next/link'

import {
  BanknoteIcon,
  BoxIcon,
  HeadphonesIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const QUICK_LINKS = [
  { label: 'Sản phẩm mới', href: '#' },
  { label: 'Flash sale', href: '#' },
  { label: 'Thương hiệu', href: '#' },
  { label: 'Bài viết', href: '#' },
]

const SUPPORT_LINKS = [
  { label: 'Trung tâm trợ giúp', href: '#' },
  { label: 'Theo dõi đơn hàng', href: '#' },
  { label: 'Chính sách đổi trả', href: '#' },
  { label: 'Chính sách bảo mật', href: '#' },
]

const COMPANY_LINKS = [
  { label: 'Giới thiệu Nest Ecom', href: '#' },
  { label: 'Tuyển dụng', href: '#' },
  { label: 'Đối tác bán hàng', href: '#' },
  { label: 'Tin tức', href: '#' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', mark: 'F' },
  { label: 'Instagram', href: '#', mark: 'IG' },
  { label: 'YouTube', href: '#', mark: 'YT' },
]

export default function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
              <ShieldCheckIcon className="size-3.5 text-primary" />
              Mua sắm an toàn, giao hàng toàn quốc
            </div>

            <div>
              <p className="text-xl font-semibold text-foreground">Nest Ecom</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Nền tảng mua sắm trực tuyến với trải nghiệm nhanh, minh bạch và dịch vụ hỗ trợ tận tâm cho mọi đơn hàng.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-3">
                <TruckIcon className="size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Giao nhanh</p>
                <p className="text-sm font-medium text-foreground">2h nội thành</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <BoxIcon className="size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Đổi trả</p>
                <p className="text-sm font-medium text-foreground">Trong 7 ngày</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <BanknoteIcon className="size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Thanh toán</p>
                <p className="text-sm font-medium text-foreground">Linh hoạt</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <HeadphonesIcon className="size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Hỗ trợ</p>
                <p className="text-sm font-medium text-foreground">24/7</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Khám phá</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-foreground">Hỗ trợ</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Về Nest Ecom</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2 rounded-lg border bg-muted/25 p-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                88 Lê Lợi, Quận 1, TP. Hồ Chí Minh
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="size-4 shrink-0 text-primary" />
                1900 6868
              </p>
              <p className="flex items-center gap-2">
                <MailIcon className="size-4 shrink-0 text-primary" />
                support@nest-ecom.vn
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Nhận ưu đãi mới</h3>
            <p className="text-sm text-muted-foreground">
              Đăng ký email để nhận thông báo về mã giảm giá, sản phẩm mới và chiến dịch flash sale mỗi tuần.
            </p>
            <form className="space-y-2" onSubmit={(event) => event.preventDefault()}>
              <Input type="email" placeholder="Nhập email của bạn" />
              <Button type="submit" className="w-full">
                Đăng ký nhận tin
              </Button>
            </form>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground">Kết nối với chúng tôi</p>
              <div className="mt-2 flex items-center gap-2">
                {SOCIAL_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex size-9 items-center justify-center rounded-full border bg-background text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {item.mark}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nest Ecom. Đã đăng ký bản quyền.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="#" className="transition-colors hover:text-primary">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Chính sách vận chuyển
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
