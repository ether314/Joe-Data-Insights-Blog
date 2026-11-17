import type { Metadata } from "next";
import Link from "next/link";
import { DisableAutoAds } from "@/components/DisableAutoAds";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That address is not in the Theta Scribe archive. Try the homepage, topics, or about the desk.",
};

export default function NotFound() {
  return (
    <div className="w-full">
      <DisableAutoAds />
      <div className="bg-[#0f1629] text-white">
        <div className="site-container py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">404</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            No story at this address
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            The path you requested is not in the Theta Scribe archive. It may have been renamed, or
            it may never have existed. The publication is still here — start from a real page.
          </p>
        </div>
      </div>
      <div className="site-container py-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/", title: "Homepage", body: "What this desk publishes and the latest visual essays." },
            { href: "/blog", title: "Archive", body: "The full catalog of original chart-and-analysis stories." },
            { href: "/categories", title: "Topics", body: "Economics, energy, health, logistics, and the other desks." },
            { href: "/about", title: "About", body: "Who publishes Theta Scribe and what original work means here." },
            { href: "/methodology", title: "Editorial standards", body: "How numbers, sources, and corrections are handled." },
            { href: "/contact", title: "Contact", body: "Corrections, permissions, and questions for the desk." },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
              >
                <h2 className="font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
