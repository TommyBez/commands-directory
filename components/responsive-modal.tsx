'use client'

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

type ResponsiveModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

type ResponsiveModalContentProps = {
  className?: string
  children: ReactNode
}

type ResponsiveModalHeaderProps = {
  className?: string
  children: ReactNode
}

type ResponsiveModalFooterProps = {
  className?: string
  children: ReactNode
}

type ResponsiveModalTitleProps = {
  className?: string
  children: ReactNode
}

type ResponsiveModalDescriptionProps = {
  className?: string
  children: ReactNode
}

export function ResponsiveModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet onOpenChange={onOpenChange} open={open}>
        {children}
      </Sheet>
    )
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {children}
    </Dialog>
  )
}

export function ResponsiveModalContent({
  className,
  children,
}: ResponsiveModalContentProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetContent className={`max-h-[90vh] ${className || ''}`} side="bottom">
        {children}
      </SheetContent>
    )
  }

  return <DialogContent className={className}>{children}</DialogContent>
}

export function ResponsiveModalHeader({
  className,
  children,
}: ResponsiveModalHeaderProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetHeader className={className}>{children}</SheetHeader>
  }

  return <DialogHeader className={className}>{children}</DialogHeader>
}

export function ResponsiveModalFooter({
  className,
  children,
}: ResponsiveModalFooterProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetFooter className={className}>{children}</SheetFooter>
  }

  return <DialogFooter className={className}>{children}</DialogFooter>
}

export function ResponsiveModalTitle({
  className,
  children,
}: ResponsiveModalTitleProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetTitle className={className}>{children}</SheetTitle>
  }

  return <DialogTitle className={className}>{children}</DialogTitle>
}

export function ResponsiveModalDescription({
  className,
  children,
}: ResponsiveModalDescriptionProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetDescription className={className}>{children}</SheetDescription>
  }

  return <DialogDescription className={className}>{children}</DialogDescription>
}
