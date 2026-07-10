import type { ComponentType } from "react";
import type { Category } from "@/types/post";

interface IconProps {
  className?: string;
}

export function EconomicsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M4 26V14l6 4 6-8 6 5 6-9v20H4z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M4 26 L10 20 L16 12 L22 17 L28 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function PoliticsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 14h6M22 14h6M16 4v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      <circle cx="6" cy="14" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="26" cy="14" r="1.5" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

export function FinanceCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 4L6 9v8c0 6.2 4.3 11.9 10 13 5.7-1.1 10-6.8 10-13V9L16 4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 16h8M12 20h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 12l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TechnologyCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect x="17" y="10" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
      <rect x="10" y="17" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
      <rect x="17" y="17" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.8" />
      <path d="M16 2v4M16 26v4M2 16h4M26 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<
  Category,
  ComponentType<{ className?: string }>
> = {
  Economics: EconomicsCategoryIcon,
  Politics: PoliticsCategoryIcon,
  Finance: FinanceCategoryIcon,
  Technology: TechnologyCategoryIcon,
};
