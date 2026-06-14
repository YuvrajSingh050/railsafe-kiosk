import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  const now = new Date();
  const date = format(now, 'yyyyMMdd');
  const time = format(now, 'HHmmss');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RS-${date}-${time}-${rand}`;
}
