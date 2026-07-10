import { format, formatDistanceToNow } from "date-fns";

export function formatPostDate(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

export function formatRelativeDate(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
