import { format, formatDistance, formatRelative } from "date-fns"

export function formatDate(date: string | Date, formatStr = "MMM d, yyyy"): string {
  return format(new Date(date), formatStr)
}

export function formatRelativeDate(date: string | Date): string {
  return formatRelative(new Date(date), new Date())
}

export function formatDistanceDate(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
