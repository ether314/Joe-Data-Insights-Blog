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

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0f1629] text-slate-400">
      <div className="site-container flex items-center justify-center py-6 text-center text-xs">
        <a
          href="https://linktr.ee/ether690"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
        >
          <LinktreeIcon className="h-5 w-5 text-[#43e660]" />
          <span>linktr.ee/ether690</span>
        </a>
      </div>
    </footer>
  );
}
