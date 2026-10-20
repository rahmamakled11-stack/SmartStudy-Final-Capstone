import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ====== Functions اللي ناقصة ======

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "in-progress":
      return "bg-blue-500"
    case "pending":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "hard":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "easy":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export function formatDate(date: string | Date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}