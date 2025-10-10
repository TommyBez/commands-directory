'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { logger } from '@/lib/logger'

type ModerationActionsProps = {
  commandId: string
  currentStatus: string
}

export function ModerationActions({
  commandId,
  currentStatus,
}: ModerationActionsProps) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    setIsApproving(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/commands/${commandId}/approve`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve command')
      }

      router.refresh()
    } catch (err) {
      logger.error('Error approving command:', err)
      setError(err instanceof Error ? err.message : 'Failed to approve command')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/commands/${commandId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: rejectionReason.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject command')
      }

      setRejectDialogOpen(false)
      setRejectionReason('')
      router.refresh()
    } catch (err) {
      logger.error('Error rejecting command:', err)
      setError(err instanceof Error ? err.message : 'Failed to reject command')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        {currentStatus === 'pending' && (
          <>
            <Button
              className="flex-1 sm:flex-initial"
              disabled={isApproving}
              onClick={handleApprove}
              type="button"
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>

            <Dialog onOpenChange={setRejectDialogOpen} open={rejectDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex-1 sm:flex-initial"
                  type="button"
                  variant="destructive"
                >
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Command</DialogTitle>
                  <DialogDescription>
                    Optionally provide a reason for rejecting this command. This
                    will be visible to the submitter.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Rejection Reason (Optional)</Label>
                    <Textarea
                      id="reason"
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g., Command is too vague or already exists"
                      rows={4}
                      value={rejectionReason}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setRejectDialogOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isRejecting}
                    onClick={handleReject}
                    type="button"
                    variant="destructive"
                  >
                    {isRejecting ? 'Rejecting...' : 'Reject Command'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {currentStatus === 'rejected' && (
          <Button
            className="flex-1 sm:flex-initial"
            disabled={isApproving}
            onClick={handleApprove}
            type="button"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
        )}

        {currentStatus === 'approved' && (
          <Dialog onOpenChange={setRejectDialogOpen} open={rejectDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex-1 sm:flex-initial"
                type="button"
                variant="destructive"
              >
                Revoke Approval
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Revoke Command Approval</DialogTitle>
                <DialogDescription>
                  Provide a reason for revoking the approval. This will hide the
                  command from public view.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Command contains outdated information"
                    rows={4}
                    value={rejectionReason}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setRejectDialogOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isRejecting}
                  onClick={handleReject}
                  type="button"
                  variant="destructive"
                >
                  {isRejecting ? 'Revoking...' : 'Revoke Approval'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
