'use client'

import { BellIcon, LockIcon, ShieldCheckIcon, SmartphoneIcon } from 'lucide-react'
import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

type SettingItemProps = {
  title: string
  description: string
  defaultChecked?: boolean
}

function SettingItem({ title, description, defaultChecked = false }: SettingItemProps) {
  const [checked, setChecked] = React.useState(defaultChecked)

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40"
      onClick={() => setChecked((prev) => !prev)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setChecked((prev) => !prev)
        }
      }}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium leading-5">{title}</p>
        <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      />
    </div>
  )
}

export default function Settings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BellIcon className="size-4 text-primary" />
            Thông báo
          </CardTitle>
          <CardDescription>Tùy chỉnh cách bạn nhận thông báo từ hệ thống và các chương trình ưu đãi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingItem
            title="Thông báo khuyến mãi"
            description="Nhận tin giảm giá, mã ưu đãi và các chiến dịch mua sắm đặc biệt."
            defaultChecked
          />
          <SettingItem
            title="Thông báo đơn hàng"
            description="Cập nhật trạng thái đơn hàng: xác nhận, đóng gói, giao hàng và hoàn tất."
            defaultChecked
          />
          <SettingItem title="Email bản tin" description="Nhận bản tin hàng tuần về mẹo mua sắm và sản phẩm mới." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LockIcon className="size-4 text-primary" />
            Bảo mật tài khoản
          </CardTitle>
          <CardDescription>Tăng cường bảo mật để bảo vệ tài khoản và dữ liệu cá nhân của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingItem title="Xác thực 2 lớp" description="Yêu cầu mã xác thực bổ sung khi đăng nhập từ thiết bị lạ." />
          <SettingItem
            title="Cảnh báo đăng nhập bất thường"
            description="Gửi cảnh báo khi phát hiện đăng nhập ở vị trí hoặc thiết bị mới."
            defaultChecked
          />
          <SettingItem
            title="Xác minh qua ứng dụng"
            description="Sử dụng ứng dụng xác thực để tạo mã OTP thay vì SMS."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheckIcon className="size-4 text-primary" />
            Quyền riêng tư
          </CardTitle>
          <CardDescription>
            Quản lý quyền hiển thị hồ sơ và cách dữ liệu được sử dụng để cá nhân hóa trải nghiệm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingItem
            title="Hiển thị hồ sơ công khai"
            description="Cho phép hiển thị tên và avatar khi bạn đánh giá sản phẩm."
          />
          <SettingItem
            title="Cá nhân hóa đề xuất"
            description="Sử dụng lịch sử xem và mua hàng để gợi ý sản phẩm phù hợp hơn."
            defaultChecked
          />
          <SettingItem
            title="Đăng nhập bằng thiết bị tin cậy"
            description="Giữ đăng nhập lâu hơn trên thiết bị cá nhân của bạn."
            defaultChecked
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <SmartphoneIcon className="size-4 text-primary" />
            Thiết bị kết nối
          </CardTitle>
          <CardDescription>Đồng bộ trải nghiệm trên nhiều thiết bị và quản lý trạng thái đăng nhập.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingItem
            title="Đồng bộ giỏ hàng"
            description="Tự động đồng bộ sản phẩm trong giỏ hàng giữa các thiết bị."
            defaultChecked
          />
          <SettingItem
            title="Đồng bộ danh sách yêu thích"
            description="Lưu và cập nhật danh sách yêu thích trên điện thoại và máy tính."
            defaultChecked
          />
        </CardContent>
      </Card>
    </div>
  )
}
