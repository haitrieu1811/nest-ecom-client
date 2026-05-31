import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import useLogout from '@/hooks/use-logout'
import { useAppStore } from '@/providers/app.provider'

export default function HeaderAccount() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAppStore()
  const isClient = useIsClient()

  const { handleLogout } = useLogout({
    onSuccess: () => {
      // Nếu đăng xuất lúc ở các trang private thì redirect về trang login sau khi logout thành công
      if (pathname.startsWith(PATH.ACCOUNT)) {
        router.push(PATH.LOGIN)
      }
    },
  })

  if (!profile || !isClient) return <Skeleton className="size-10 rounded-full" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={profile.avatar || ''} alt={profile.name || 'User'} />
            <AvatarFallback>{profile.name?.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={PATH.ACCOUNT}>Tài khoản</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Đơn mua</DropdownMenuItem>
          <DropdownMenuItem>Cài đặt</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
