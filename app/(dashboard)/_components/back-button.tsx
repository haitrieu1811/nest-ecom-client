'use client'

import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function BackButton() {
  const router = useRouter()
  return (
    <Button size="icon" variant="outline" onClick={() => router.back()}>
      <ChevronLeftIcon className="size-4" />
    </Button>
  )
}
