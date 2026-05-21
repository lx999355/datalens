"use client"
import { Modal } from "./Modal"
import { Button } from "./Button"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  variant?: "danger" | "primary"
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message, confirmText = "确认", variant = "danger"
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-muted-foreground mb-8">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>取消</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose() }}>{confirmText}</Button>
      </div>
    </Modal>
  )
}