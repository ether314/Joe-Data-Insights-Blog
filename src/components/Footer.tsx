import Link from "next/link";
import { SITE_LINKTREE, SITE_LINKTREE_LABEL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

function LinktreeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 2.033a.698.698 0 01-.979 0l-1.232-1.263a.698.698 0 00-.979 0l-1.232 1.263a.698.698 0 01-.979 0l-1.97-2.033a.698.698 0 010-.979l1.97-2.033a.698.698 0 01.979 0l1.232 1.263a.698.698 0 00.979 0l1.232-1.263a.698.698 0 01.979 0l1.97 2.033a.698.698 0 010 .979z" />
    </svg>
  );
}

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Archive" },
  { href: "/categories", label: "Topics" },
] as const;

const DESK_LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Editorial standards" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0f1629] text-slate-400">
      <div className="site-container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-base font-bold text-white">{SITE_NAME}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-cyan-400/90">
              {SITE_TAGLINE}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Independent research desk. Original interactive charts from public datasets, with
              sources named so you can check the originating file. Corrections welcome via Contact.
            </p>
            <a
              href={SITE_LINKTREE}
              target="_blank"
              rel="me noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <LinktreeIcon className="h-4 w-4 text-[#43e660]" />
              <span>{SITE_LINKTREE_LABEL}</span>
            </a>
          </div>

          <FooterColumn title="Publication" links={EXPLORE_LINKS} />
          <FooterColumn title="The desk" links={DESK_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
          <p>
            © {year} {SITE_NAME}. Independent research publication. This site uses cookies for
            Google Analytics and Google AdSense.{" "}
            <Link href="/privacy" className="text-slate-300 underline underline-offset-2 hover:text-cyan-300">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-cyan-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
