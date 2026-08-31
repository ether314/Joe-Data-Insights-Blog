"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { PostSearchRecord } from "@/types/post";

const DEBOUNCE_MS = 150;
const MAX_RESULTS = 8;

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function haystack(post: PostSearchRecord): { title: string; rest: string } {
  return {
    title: normalize(post.title),
    rest: normalize(
      [post.excerpt, post.category, post.themeId, ...(post.tags ?? [])]
        .filter(Boolean)
        .join(" "),
    ),
  };
}

function filterPosts(
  posts: PostSearchRecord[],
  query: string,
): PostSearchRecord[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { post: PostSearchRecord; score: number }[] = [];
  for (const post of posts) {
    const { title, rest } = haystack(post);
    const all = `${title} ${rest}`;
    if (!tokens.every((token) => all.includes(token))) continue;
    const titleHit = tokens.every((token) => title.includes(token));
    const categoryHit = tokens.every((token) =>
      normalize(post.category).includes(token),
    );
    scored.push({ post, score: titleHit ? 0 : categoryHit ? 1 : 2 });
  }

  scored.sort(
    (a, b) => a.score - b.score || a.post.title.localeCompare(b.post.title),
  );
  return scored.slice(0, MAX_RESULTS).map((row) => row.post);
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SiteSearch({ posts }: { posts: PostSearchRecord[] }) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(
    () => filterPosts(posts, debounced),
    [posts, debounced],
  );
  const trimmed = debounced.trim();
  const showList = open && trimmed.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [debounced]);

  const close = useCallback((options?: { clear?: boolean }) => {
    setOpen(false);
    setMobileOpen(false);
    if (options?.clear) {
      setQuery("");
      setDebounced("");
    }
  }, []);

  const goTo = useCallback(
    (slug: string) => {
      close({ clear: true });
      inputRef.current?.blur();
      router.push(`/blog/${slug}`);
    },
    [close, router],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      setMobileOpen(true);
      setOpen(true);
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [close]);

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close({ clear: true });
      inputRef.current?.blur();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showList || results.length === 0) return;
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!showList || results.length === 0) return;
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) goTo(target.slug);
    }
  }

  const fieldOpen = mobileOpen;

  return (
    <div ref={containerRef} role="search" className="relative">
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white sm:hidden ${
          fieldOpen ? "invisible" : ""
        }`}
        aria-label="Search articles"
        onClick={() => {
          setMobileOpen(true);
          setOpen(true);
          window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <SearchIcon className="h-4 w-4" />
      </button>

      <div
        className={
          fieldOpen
            ? "absolute right-0 top-1/2 z-20 w-[min(calc(100vw-7rem),20rem)] -translate-y-1/2 sm:static sm:top-auto sm:right-auto sm:w-auto sm:translate-y-0"
            : "hidden sm:block"
        }
      >
        <label htmlFor={inputId} className="sr-only">
          Search articles
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search articles"
            value={query}
            aria-label="Search articles"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            aria-activedescendant={
              showList && results[activeIndex]
                ? `${listId}-opt-${activeIndex}`
                : undefined
            }
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onInputKeyDown}
            className="h-9 w-full rounded-xl bg-white/10 py-1.5 pl-8 pr-8 text-sm text-white placeholder:text-slate-400 ring-1 ring-white/15 transition focus:bg-white/15 focus:outline-none focus:ring-cyan-400/50 sm:w-44 md:w-52 lg:w-64"
          />
          {query ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setDebounced("");
                inputRef.current?.focus();
              }}
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-white/15 px-1.5 py-0.5 font-sans text-[10px] font-medium text-slate-500 sm:inline">
              /
            </kbd>
          )}
        </div>
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Article search results"
          className="absolute right-0 z-30 mt-2 max-h-[min(24rem,70vh)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-white/10 bg-[#121a30] py-1 shadow-xl max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-[4.75rem] max-sm:mt-0 max-sm:w-auto sm:top-full"
        >
          {results.length === 0 ? (
            <li role="status" className="px-3 py-3 text-sm text-slate-400">
              No matching posts
            </li>
          ) : (
            results.map((post, index) => (
              <li key={post.slug} role="presentation">
                <Link
                  id={`${listId}-opt-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  href={`/blog/${post.slug}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => close({ clear: true })}
                  className={`block px-3 py-2 transition ${
                    index === activeIndex
                      ? "bg-cyan-500/15"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="block text-sm font-medium text-white">
                    {post.title}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-cyan-300/80">
                    {post.category}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
