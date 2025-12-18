import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBiasLevel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function getBiasColor(level: string): string {
  switch (level) {
    case 'none':
      return 'bg-green-400'
    case 'mild':
      return 'bg-yellow-400'
    case 'moderate':
      return 'bg-orange-400'
    case 'high':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
}

export function getBiasTextColor(level: string): string {
  switch (level) {
    case 'none':
      return 'text-green-600'
    case 'mild':
      return 'text-yellow-600'
    case 'moderate':
      return 'text-orange-600'
    case 'high':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

