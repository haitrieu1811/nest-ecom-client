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
import PATH from '@/constants/path'
import useLogout from '@/hooks/use-logout'
import { normalizePath } from '@/lib/utils'
import { useAppStore } from '@/providers/app.provider'

export default function HeaderAccount() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAppStore()

  const { handleLogout } = useLogout({
    onSuccess: () => {
      // Nếu đăng xuất lúc ở các trang private thì redirect về trang login sau khi logout thành công
      if (normalizePath(pathname).startsWith(PATH.ACCOUNT)) {
        router.push(PATH.LOGIN)
      }
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={profile?.avatar || ''} alt={profile?.name || 'User'} />
            <AvatarFallback>{`${profile?.email?.[0].toLocaleUpperCase()}${profile?.email?.[1]?.toLocaleUpperCase() || ''}`}</AvatarFallback>
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
