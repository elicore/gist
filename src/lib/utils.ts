import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge and deduplicate CSS class names
 * Combines clsx for conditional classes with tailwind-merge for Tailwind CSS deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
