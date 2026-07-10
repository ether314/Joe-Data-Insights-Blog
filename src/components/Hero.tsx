import { HeroDataBackground } from "@/components/HeroDataBackground";

export function Hero() {
  return (
    <section className="relative flex h-28 items-center justify-center overflow-hidden bg-[#0a0f1c] text-white sm:h-32">
      <HeroDataBackground subtle />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,15,28,0.75)_100%)]" />
      <div className="relative z-10 px-4 text-center">
        <h1 className="hero-reveal-title">
          Data,{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Revealed
          </span>
        </h1>
      </div>
    </section>
  );
}
