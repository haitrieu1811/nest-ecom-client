import { Trash2Icon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type AlertDialogDestructiveProps = {
  open: boolean
  title?: string
  description?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function AlertDialogDestructive({
  open,
  title = 'Bạn có chắc muốn thực hiện hành động này?',
  description = 'Hành động này sẽ có những tác động không thể đảo ngược. Hãy chắc chắn rằng bạn muốn tiếp tục.',
  onOpenChange,
  onConfirm,
}: AlertDialogDestructiveProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
