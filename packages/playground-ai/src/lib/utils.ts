import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const rootValue = 16;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function rem(px: number) {
  return px / rootValue + 'rem';
}
