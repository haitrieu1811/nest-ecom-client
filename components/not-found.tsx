import { LucideIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import PATH from '@/constants/path'

type NotFoundProps = {
  icon?: LucideIcon
  title?: string
  description?: string
  redirect?: {
    text: string
    path: string
  }
}

export default function NotFound({
  icon: Icon = SearchIcon,
  title = 'Không tìm thấy thông tin',
  description = 'Không tìm thấy thông tin bạn đang tìm kiếm.',
  redirect = {
    text: 'Quay lại trang chủ',
    path: PATH.DASHBOARD,
  },
}: NotFoundProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-4" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="sm">
          <Link href={redirect.path}>{redirect.text}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
