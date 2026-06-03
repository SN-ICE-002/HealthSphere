/**
 * Simple utility to conditionally join classnames
 * Similar to classnames library but lightweight
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
