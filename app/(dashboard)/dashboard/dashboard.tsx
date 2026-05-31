'use client'

import useIsClient from '@/hooks/use-is-client'
import { useAppStore } from '@/providers/app.provider'
import React from 'react'

const getCurrentPeriod = (date = new Date()) => {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return 'sáng'
  if (hour >= 11 && hour < 13) return 'trưa'
  if (hour >= 13 && hour < 18) return 'chiều'
  if (hour >= 18 && hour < 22) return 'tối'
  return 'đêm'
}

export default function Dashboard() {
  const { profile } = useAppStore()
  const isClient = useIsClient()

  return (
    <React.Fragment>
      {profile && isClient && (
        <div className="px-8 pt-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold">
              Chào buổi {getCurrentPeriod()}, {profile.name || profile.email}
            </h1>
            <p className="text-muted-foreground text-sm">
              Đây là trang tổng quan của bạn. Tại đây, bạn có thể xem các thông tin tổng quan về tài khoản, hoạt động
              gần đây và các tính năng khác của ứng dụng.
            </p>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
