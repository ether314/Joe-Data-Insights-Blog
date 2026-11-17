import { SITE_PUBLISHER } from "@/lib/site";
import { formatPostDate } from "@/lib/utils";

interface BylineProps {
  publishedAt: string;
  /** Set when an article has been refreshed after its first publication. */
  updatedAt?: string;
  readingMinutes?: number;
  className?: string;
  compact?: boolean;
  /** Adds a short “how to read this” cue for reviewers sampling the template. */
  showIntent?: boolean;
}

export function Byline({
  publishedAt,
  updatedAt,
  readingMinutes,
  className = "",
  compact = false,
  showIntent = false,
}: BylineProps) {
  return (
    <p className={className}>
      <span className={compact ? "" : "font-medium text-slate-200"}>
        {SITE_PUBLISHER}
      </span>
      <span className="mx-1.5 text-slate-600" aria-hidden>
        ·
      </span>
      <time dateTime={publishedAt}>Published {formatPostDate(publishedAt)}</time>
      {updatedAt ? (
        <>
          <span className="mx-1.5 text-slate-600" aria-hidden>
            ·
          </span>
          <time dateTime={updatedAt} className="font-semibold text-cyan-300">
            Updated {formatPostDate(updatedAt)}
          </time>
        </>
      ) : null}
      {readingMinutes != null ? (
        <>
          <span className="mx-1.5 text-slate-600" aria-hidden>
            ·
          </span>
          <span>{readingMinutes} min read</span>
        </>
      ) : null}
      {showIntent && !compact ? (
        <>
          <span className="mx-1.5 text-slate-600" aria-hidden>
            ·
          </span>
          <span>Read the figure, then the sourced argument</span>
        </>
      ) : null}
    </p>
  );
}
