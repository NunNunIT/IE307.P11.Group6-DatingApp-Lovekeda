import { User } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNewUser(user: User) {
  return user.last_sign_in_at &&
    new Date(user.created_at).getTime() ===
    new Date(user.last_sign_in_at).getTime()
}
