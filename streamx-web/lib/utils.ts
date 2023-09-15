import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRelativeTime(time: string | number | Date) {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const dayDiff = Math.floor(diff / 86400000)

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return date.toLocaleDateString()
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60000 && "just now") ||
        (diff < 120000 && "1 minute ago") ||
        (diff < 3600000 && Math.floor(diff / 60000) + " minutes ago") ||
        (diff < 7200000 && "1 hour ago") ||
        (diff < 86400000 && Math.floor(diff / 3600000) + " hours ago"))) ||
    (dayDiff === 1 && "Yesterday") ||
    (dayDiff < 7 && dayDiff + " days ago") ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + " weeks ago")
  )
}

export const getUserAvatar = (username: string) => {
  const colors = [
    "EF4444",
    "3B82F6",
    "10B981",
    "F59E0B",
    "6366F1",
    "8B5CF6",
    "EC4899",
  ]
  const charCode = username.charCodeAt(0)
  const colorIndex = charCode % colors.length
  const color = colors[colorIndex]
  return `https://ui-avatars.com/api/?rounded=true&name=${username}&background=${color}`
}

export const getUsernameColor = (username: string) => {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-indigo-500",
    "text-purple-500",
    "text-pink-500",
  ]
  const charCode = username.charCodeAt(0)
  const colorIndex = charCode % colors.length
  return colors[colorIndex]
}