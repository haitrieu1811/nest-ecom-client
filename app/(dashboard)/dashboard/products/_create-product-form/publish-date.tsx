/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { isSameDay } from 'date-fns'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { CreateProductBodyType } from '@/schemas/product.schema'

export default function PublishDate() {
  const form = useFormContext<CreateProductBodyType>()

  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const publishedAt = form.watch('publishedAt')
  const publishDate = publishedAt ? new Date(publishedAt) : null
  const isPublishToday = publishDate !== null && isSameDay(publishDate, new Date())
  const publishDateText = publishDate ? publishDate.toLocaleDateString('vi-VN') : null

  const handleChangeDatePublish = (date: Date | undefined) => {
    form.setValue('publishedAt', date ? date.toISOString() : null)
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Ngày public</FieldLabel>
        <FieldDescription>
          {isPublishToday
            ? 'Đang chọn chế độ public ngay lập tức'
            : publishDateText
              ? `Đang chọn: ${publishDateText}`
              : 'Chưa chọn ngày public'}
        </FieldDescription>
        <div className="rounded-xl border bg-linear-to-b from-background to-muted/20 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Bạn có thể lên lịch hoặc chọn hôm nay.</p>
            <Button
              type="button"
              size="sm"
              onClick={() => handleChangeDatePublish(new Date())}
              disabled={isPublishToday}
            >
              {!isPublishToday ? 'Chọn hôm nay' : 'Đang chọn hôm nay'}
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="w-fit rounded-lg border bg-background shadow-xs">
              <Calendar
                mode="single"
                timeZone={timeZone}
                selected={form.watch('publishedAt') ? new Date(form.watch('publishedAt') as string) : undefined}
                onSelect={(date) => {
                  console.log(date)
                  console.log(date?.toISOString())
                  handleChangeDatePublish(date)
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Ngày</p>
                  <p className="text-lg font-semibold">{publishDate ? publishDate.getDate() : '--'}</p>
                </div>
                <div className="rounded-lg border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Tháng</p>
                  <p className="text-lg font-semibold">{publishDate ? publishDate.getMonth() + 1 : '--'}</p>
                </div>
                <div className="rounded-lg border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Năm</p>
                  <p className="text-lg font-semibold">{publishDate ? publishDate.getFullYear() : '--'}</p>
                </div>
              </div>

              <div className="rounded-lg border border-dashed bg-background px-3 py-2 text-sm">
                {isPublishToday
                  ? 'Sản phẩm sẽ được public ngay khi bạn tạo.'
                  : publishDateText
                    ? `Sản phẩm sẽ được public vào ${publishDateText}.`
                    : 'Chọn ngày trên lịch để lên kế hoạch public sản phẩm.'}
              </div>
            </div>
          </div>
        </div>
      </Field>
    </FieldGroup>
  )
}
