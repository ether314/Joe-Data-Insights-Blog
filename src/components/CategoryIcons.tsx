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

export function GlobalSystemsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="4" ry="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M6 16h20M8 10.5c2.5 1 5.5 1.5 8 1.5s5.5-.5 8-1.5M8 21.5c2.5-1 5.5-1.5 8-1.5s5.5.5 8 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
      <circle cx="22" cy="12" r="2" fill="currentColor" />
      <circle cx="10" cy="20" r="2" fill="currentColor" fillOpacity="0.7" />
      <circle cx="24" cy="20" r="1.5" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

export function EnergyCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M18 3L10 17h6l-2 12 10-16h-6l2-10z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 26h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <path
        d="M8 22v4M16 20v6M24 22v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
    </svg>
  );
}

export function IndustryCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M6 26V14l6-3v15H6zm8 0V8l6-3v21h-6zm8 0V11l6 3v12h-6z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" fillOpacity="0.55" />
      <circle cx="20" cy="14" r="2" fill="currentColor" fillOpacity="0.75" />
      <path
        d="M4 26h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

export function ConsumerFinanceCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect
        x="5"
        y="9"
        width="22"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 14h22"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.55"
      />
      <rect x="8" y="18" width="8" height="3" rx="1" fill="currentColor" fillOpacity="0.45" />
      <circle cx="22" cy="19.5" r="2" fill="currentColor" fillOpacity="0.75" />
      <path
        d="M9 6h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

export function CapitalMarketsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M6 24V18l5-3 5 5 5-8 5 4v8H6z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 24h20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <path
        d="M22 8l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 11h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HealthEconomicsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 26S5 19.6 5 12.4C5 8.3 8.2 6 11.2 6c1.9 0 3.7.9 4.8 2.5C17.1 6.9 18.9 6 20.8 6 23.8 6 27 8.3 27 12.4 27 19.6 16 26 16 26z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 15h3l1.5-3 2.5 6 2-3h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LaborSkillsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="4" y="14" width="24" height="7" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 14V8h14v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="11" r="1.5" fill="currentColor" fillOpacity="0.6" />
      <circle cx="19" cy="11" r="1.5" fill="currentColor" fillOpacity="0.6" />
      <path
        d="M8 21v5M16 21v5M24 21v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
    </svg>
  );
}

export function RealEstateCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M5 15L16 6l11 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13v13h16V13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="13" y="18" width="6" height="8" fill="currentColor" fillOpacity="0.35" />
      <path
        d="M22 8v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

export function FoodAgricultureCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 27C16 18 16 12 16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 12c-4 0-6-2.5-6-6 4 0 6 2 6 6zM16 12c4 0 6-2.5 6-6-4 0-6 2-6 6z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M16 19c-5 0-8-3-8-8 5.5 0 8 3 8 8z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 27h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
    </svg>
  );
}

export function TransportLogisticsCategoryIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="3" y="10" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M18 13h6l4 4v3h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="23" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="23" cy="23" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M11.5 23H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.6"
      />
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
  "Global Systems": GlobalSystemsCategoryIcon,
  Energy: EnergyCategoryIcon,
  Industry: IndustryCategoryIcon,
  "Consumer Finance": ConsumerFinanceCategoryIcon,
  "Capital Markets": CapitalMarketsCategoryIcon,
  "Health Economics": HealthEconomicsCategoryIcon,
  "Labor & Skills": LaborSkillsCategoryIcon,
  "Real Estate": RealEstateCategoryIcon,
  "Food & Agriculture": FoodAgricultureCategoryIcon,
  "Transport & Logistics": TransportLogisticsCategoryIcon,
};
