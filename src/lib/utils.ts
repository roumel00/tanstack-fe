import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStorageUrl(key: string): string {
  return `${import.meta.env.VITE_S3_PUBLIC_URL}/${key}`
}
