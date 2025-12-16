import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Remove brand mentions from video titles for display purposes.
 * Currently strips common variants of "GeeksforGeeks" and "GfG" and
 * trims leftover separators like | or -.
 */
export function sanitizeTitle(title: string | undefined) {
  if (!title) return title || '';
  // remove known brand keywords
  let t = title.replace(/\b(Geeks\s*for\s*Geeks|GeeksforGeeks|Geeksforgeeks|GfG)\b/gi, '').trim();
  // strip leading/trailing separators and whitespace
  t = t.replace(/^[\s\|\-–:]+|[\s\|\-–:]+$/g, '').trim();
  // normalize separators inside to ' | '
  t = t.replace(/[\s]*[\|\-–:][\s]*/g, ' | ');
  // collapse repeated separators
  t = t.replace(/(\|\s*){2,}/g, ' | ').trim();
  // if we stripped everything (unlikely), fallback to original title without trailing brand segment
  if (!t) {
    const fallback = title.replace(/[\s]*[\|\-–:][\s]*((Geeks\s*for\s*Geeks|GeeksforGeeks|Geeksforgeeks|GfG))$/i, '').trim();
    return fallback || title;
  }
  return t;
}
