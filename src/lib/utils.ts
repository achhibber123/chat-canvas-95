import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 1) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return minutes < 1 ? 'Just now' : `${minutes}m ago`;
  }

  if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`;
  }

  if (diffDays < 7) {
    return `${Math.floor(diffDays)}d ago`;
  }

  return date.toLocaleDateString();
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function createChatTitle(firstMessage: string): string {
  // Clean and truncate the first user message to create a title
  const cleaned = firstMessage.replace(/\s+/g, ' ').trim();
  return truncateText(cleaned, 40);
}

export function searchInText(query: string, text: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function formatElapsedTime(seconds: number): string {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  }
  return `${seconds.toFixed(2)}s`;
}