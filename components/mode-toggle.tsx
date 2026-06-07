'use client'

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@teispace/next-themes'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const options = [
    { value: 'light', label: 'Sáng', Icon: SunIcon },
    { value: 'dark', label: 'Tối', Icon: MoonIcon },
    { value: 'system', label: 'Hệ thống', Icon: MonitorIcon },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-border/70 bg-background/80 shadow-sm transition-all hover:bg-accent/70"
        >
          <SunIcon className="size-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute size-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl border-border/70 p-1">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="rounded-lg px-2.5 py-2"
          >
            <option.Icon className="size-4 text-muted-foreground" />
            <span className="flex-1">{option.label}</span>
            {theme === option.value && <CheckIcon className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
