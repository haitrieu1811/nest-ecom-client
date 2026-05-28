import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Đang tải...</EmptyTitle>
        <EmptyDescription>
          Vui lòng chờ trong khi chúng tôi xử lý yêu cầu của bạn. Không làm mới trang.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
