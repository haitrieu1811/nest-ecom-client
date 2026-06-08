'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'

import { InputNumber } from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuantityControllerProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function QuantityController({
  value,
  onChange,
  max,
  disabled = false,
  className,
  size = 'md',
}: QuantityControllerProps) {
  const [localValue, setLocalValue] = React.useState<number | undefined>(value)
  const [isFocused, setIsFocused] = React.useState(false)

  // Sync with value from parent
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value)
  }, [value])

  const handleInputChange = (val: number | undefined) => {
    if (disabled) return
    if (val !== undefined && max !== undefined && val > max) {
      setLocalValue(max)
      onChange?.(max)
    } else {
      setLocalValue(val)
      if (val !== undefined && val > 0) {
        onChange?.(val)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    let finalValue = localValue
    if (finalValue === undefined || finalValue <= 0) {
      finalValue = 1
    } else if (max !== undefined && finalValue > max) {
      finalValue = max
    }
    setLocalValue(finalValue)
    onChange?.(finalValue)
  }

  const handleDecrement = () => {
    if (disabled) return
    let finalValue = (localValue ?? 1) - 1
    if (finalValue <= 0) {
      finalValue = 1
    }
    setLocalValue(finalValue)
    onChange?.(finalValue)
  }

  const handleIncrement = () => {
    if (disabled) return
    let finalValue = (localValue ?? 1) + 1
    if (max !== undefined && finalValue > max) {
      finalValue = max
    }
    setLocalValue(finalValue)
    onChange?.(finalValue)
  }

  const isDecrementDisabled = disabled || (localValue !== undefined && localValue <= 1)
  const isIncrementDisabled = disabled || (max !== undefined && localValue !== undefined && localValue >= max)

  const sizeClasses = {
    sm: {
      container: 'h-8',
      button: 'w-8',
      input: 'w-10 text-xs',
      icon: 'size-3',
    },
    md: {
      container: 'h-9',
      button: 'w-9',
      input: 'w-12 text-sm',
      icon: 'size-3.5',
    },
    lg: {
      container: 'h-10',
      button: 'w-10',
      input: 'w-14 text-base',
      icon: 'size-4',
    },
  }[size]

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-slate-200 bg-background transition-[color,box-shadow] shadow-xs select-none dark:border-slate-800',
        sizeClasses.container,
        isFocused && 'border-primary ring-3 ring-primary/15',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className={cn(
          'h-full rounded-none rounded-l-md border-r border-slate-200 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-30 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:active:bg-slate-700',
          sizeClasses.button,
        )}
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
      >
        <Minus className={sizeClasses.icon} />
      </Button>

      <InputNumber
        value={localValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        disabled={disabled}
        max={max}
        className={cn(
          'h-full border-0 bg-transparent p-0 text-center font-semibold tabular-nums text-slate-800 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-200',
          sizeClasses.input,
        )}
      />

      <Button
        type="button"
        variant="ghost"
        className={cn(
          'h-full rounded-none rounded-r-md border-l border-slate-200 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-30 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:active:bg-slate-700',
          sizeClasses.button,
        )}
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
      >
        <Plus className={sizeClasses.icon} />
      </Button>
    </div>
  )
}
