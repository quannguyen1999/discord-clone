import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//create dynamic class on tailwind 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
