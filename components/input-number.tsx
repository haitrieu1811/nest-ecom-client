import * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type InputNumberProps = Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange'> & {
  value?: number | string | null
  onChange?: (value: number | undefined) => void
  max?: number
}

/**
 * Format số thành chuỗi có dấu chấm ngăn cách hàng nghìn
 * Ví dụ: 28990000 → "28.990.000"
 */
function formatNumber(raw: string): string {
  if (!raw) return ''
  // Chỉ giữ lại chữ số
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('de-DE') // de-DE dùng dấu chấm cho hàng nghìn
}

/**
 * Lấy giá trị số thuần từ chuỗi có format
 * Ví dụ: "28.990.000" → 28990000
 */
function parseNumber(formatted: string): number | undefined {
  const digits = formatted.replace(/\D/g, '')
  if (!digits) return undefined
  const num = Number(digits)
  return isNaN(num) ? undefined : num
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  ({ className, value, onChange, onBlur, max, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      if (value === null || value === undefined || value === '') return ''
      return formatNumber(String(value))
    })

    // Sync khi value bên ngoài thay đổi (controlled)
    React.useEffect(() => {
      if (value === null || value === undefined || value === '') {
        setDisplayValue('')
        return
      }
      const externalNum = Number(String(value).replace(/\D/g, ''))
      const internalNum = parseNumber(displayValue)
      // Chỉ sync nếu giá trị thực sự khác để tránh ghi đè khi user đang gõ
      if (externalNum !== internalNum) {
        setDisplayValue(formatNumber(String(value)))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      // Chỉ cho phép chữ số và dấu chấm (dấu ngăn cách) — dùng regex để validate
      if (raw !== '' && !/^[\d.]*$/.test(raw)) return

      const parsed = parseNumber(raw)
      if (parsed !== undefined && max !== undefined && parsed > max) {
        const formattedMax = formatNumber(String(max))
        setDisplayValue(formattedMax)
        onChange?.(max)
        return
      }

      const formatted = formatNumber(raw)
      setDisplayValue(formatted)
      onChange?.(parsed)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Định dạng lại khi rời khỏi input
      setDisplayValue((prev) => formatNumber(prev))
      onBlur?.(e)
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn('tabular-nums', className)}
      />
    )
  },
)

InputNumber.displayName = 'InputNumber'

export { InputNumber }
