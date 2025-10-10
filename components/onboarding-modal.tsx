'use client'

import { useAuth } from '@clerk/nextjs'
import { BookmarkIcon, FilterIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function OnboardingModal() {
  const { userId } = useAuth()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (userId) {
      // Check if user has dismissed onboarding
      const dismissed = localStorage.getItem('onboarding_dismissed')
      if (!dismissed) {
        setOpen(true)
      }
    }
  }, [userId])

  const handleDismiss = async () => {
    localStorage.setItem('onboarding_dismissed', 'true')
    setOpen(false)

    // Optionally save to database
    if (userId) {
      try {
        await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboardingDismissed: true }),
        })
      } catch (error) {
        console.error('Failed to save onboarding state:', error)
      }
    }
  }

  const steps = [
    {
      title: 'Welcome to Cursor Commands Explorer!',
      description:
        "Discover and master keyboard shortcuts to boost your productivity. Let's take a quick tour.",
      icon: SearchIcon,
    },
    {
      title: 'Search & Filter',
      description:
        'Use our powerful search to find commands by name or description. Filter by category and tags to find the perfect command for your workflow.',
      icon: FilterIcon,
    },
    {
      title: 'Save Your Favorites',
      description:
        'Bookmark commands you use frequently and add personal notes to remember context.',
      icon: BookmarkIcon,
    },
  ]

  const currentStep = steps[step]
  const Icon = currentStep.icon

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button onClick={handleDismiss} variant="outline">
            Skip
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={handleDismiss}>Get Started</Button>
          )}
        </DialogFooter>
        <div className="mt-4 flex justify-center gap-2">
          {steps.map((stepData, i) => (
            <div
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i === step ? 'bg-primary' : 'bg-muted'
              }`}
              key={stepData.title}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
