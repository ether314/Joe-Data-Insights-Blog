interface DataInsightsLogoProps {
  className?: string;
  size?: number;
}

/** Brand mark: cyan→blue gradient tile with abstract bar + trend line. */
export function DataInsightsLogo({ className = "", size = 36 }: DataInsightsLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="di-logo-bg" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="di-logo-line" x1="8" y1="26" x2="28" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#a5f3fc" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="9" fill="url(#di-logo-bg)" />
      {/* Grid dots — data lattice */}
      <circle cx="10" cy="12" r="1.2" fill="white" fillOpacity="0.35" />
      <circle cx="16" cy="10" r="1.2" fill="white" fillOpacity="0.35" />
      <circle cx="22" cy="12" r="1.2" fill="white" fillOpacity="0.35" />
      {/* Bars */}
      <rect x="8" y="20" width="4" height="8" rx="1" fill="white" fillOpacity="0.55" />
      <rect x="14" y="16" width="4" height="12" rx="1" fill="white" fillOpacity="0.75" />
      <rect x="20" y="12" width="4" height="16" rx="1" fill="white" fillOpacity="0.95" />
      {/* Trend line overlay */}
      <path
        d="M9 24 L15 18 L21 20 L27 11"
        stroke="url(#di-logo-line)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="11" r="2" fill="#ffffff" />
    </svg>
  );
}
