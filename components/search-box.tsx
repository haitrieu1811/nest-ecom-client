import { XCircleIcon } from 'lucide-react'
import React from 'react'

import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type SearchBoxProps = {
  placeholder?: string
  isLoading?: boolean
  classNameInput?: string
  classNameWrapper?: string
  onChange?: (value: string) => void
}

export default function SearchBox({
  placeholder = 'Tìm kiếm...',
  isLoading = false,
  classNameInput,
  classNameWrapper,
  onChange,
}: SearchBoxProps) {
  const [value, setValue] = React.useState<string>('')

  const ref = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onChange?.('')
    ref.current?.focus()
  }

  return (
    <div className={cn('relative', classNameWrapper)}>
      <Input
        ref={ref}
        placeholder={placeholder}
        className={cn('pr-10', classNameInput)}
        value={value}
        onChange={handleChange}
      />
      <button
        disabled={isLoading}
        className="w-10 flex justify-center items-center absolute right-0 inset-y-0"
        onClick={handleClear}
      >
        {isLoading && <Spinner />}
        {!isLoading && value.trim() !== '' && <XCircleIcon className="size-4" />}
      </button>
    </div>
  )
}
