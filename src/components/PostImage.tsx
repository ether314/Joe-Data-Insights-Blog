import Image from "next/image";

interface PostImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

/** Renders SVGs with a native img tag — Next.js Image blocks SVGs by default. */
export function PostImage({
  src,
  alt,
  width = 1200,
  height = 675,
  className = "h-auto w-full",
  priority,
  fill,
  sizes,
}: PostImageProps) {
  if (src.endsWith(".svg")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className}`} />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  if (fill) {
    return (
      <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} unoptimized />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
