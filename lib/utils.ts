import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCommandDeeplink(
  commandName: string,
  commandContent: string,
): string {
  const baseUrl = 'cursor://anysphere.cursor-deeplink/command'
  const params = new URLSearchParams()
  params.set('name', commandName)
  params.set('text', commandContent)
  return `${baseUrl}?${params.toString()}`
}
