import Image from "next/image";

interface ThetaScribeLogoProps {
  className?: string;
  size?: number;
}

/** Theta Scribe brand mark from source PNG. */
export function ThetaScribeLogo({ className = "", size = 36 }: ThetaScribeLogoProps) {
  return (
    <Image
      src="/images/theta-scribe-icon.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
      priority
    />
  );
}
