'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  approveCommand,
  deleteCommand,
  rejectCommand,
} from '@/app/actions/commands'
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    setIsApproving(true)
    setError(null)

    try {
      const result = await approveCommand(commandId)

      if (!result.ok) {
        throw new Error(result.error || 'Failed to approve command')
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
      const result = await rejectCommand(
        commandId,
        rejectionReason.trim() || null,
      )

      if (!result.ok) {
        throw new Error(result.error || 'Failed to reject command')
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

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteCommand(commandId)

      if (!result.ok) {
        throw new Error(result.error || 'Failed to delete command')
      }

      setDeleteDialogOpen(false)
      router.refresh()
    } catch (err) {
      logger.error('Error deleting command:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete command')
    } finally {
      setIsDeleting(false)
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

        <Dialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex-1 sm:flex-initial"
              type="button"
              variant="outline"
            >
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Command</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete this command? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
                variant="destructive"
              >
                {isDeleting ? 'Deleting...' : 'Delete Command'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
