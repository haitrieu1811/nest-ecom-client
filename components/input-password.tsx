import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function InputPassword(props: React.ComponentProps<'input'>) {
  const [type, setType] = React.useState<typeof props.type>('password')

  const handleToggleType = () => {
    setType((prevType) => (prevType === 'password' ? 'text' : 'password'))
  }

  return (
    <div className="relative">
      <Input type={type} {...props} className={cn('pr-10', props.className)} />
      <button
        type="button"
        className="absolute inset-y-0 right-0 w-10 flex justify-center items-center text-muted-foreground"
        onClick={handleToggleType}
      >
        {type === 'password' ? <EyeClosedIcon size={20} /> : <EyeIcon size={20} />}
      </button>
    </div>
  )
}
