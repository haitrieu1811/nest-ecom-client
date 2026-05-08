import Link from 'next/link'

import PATH from '@/constants/path'
import ModeToggle from '@/components/mode-toggle'
import HeaderAccount from '@/app/(shop)/_components/header-account'

export default function ShopHeader() {
  return (
    <header className="flex justify-between items-center">
      <h1>Shop Header</h1>
      <div className="flex space-x-4">
        <Link href={PATH.LOGIN}>Đăng nhập</Link>
        <Link href={PATH.REGISTER}>Đăng ký</Link>
        <HeaderAccount />
        <ModeToggle />
      </div>
    </header>
  )
}
