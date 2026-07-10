"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };

export function HeroDataBackground({ subtle = false }: { subtle?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    let nodes: Node[] = [];
    let bars: number[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const opacity = subtle ? 0.45 : 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = subtle ? 28000 : 18000;
      const maxNodes = subtle ? 24 : 120;
      const minNodes = subtle ? 12 : 48;
      const count = Math.floor((width * height) / density);
      nodes = Array.from({ length: Math.min(Math.max(count, minNodes), maxNodes) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (subtle ? 0.2 : 0.35),
        vy: (Math.random() - 0.5) * (subtle ? 0.2 : 0.35),
        r: subtle ? 0.8 + Math.random() * 1.2 : 1.2 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI * 2,
      }));

      const barStep = subtle ? 22 : 14;
      const barCount = Math.floor(width / barStep);
      bars = Array.from({ length: barCount }, () => 0.2 + Math.random() * 0.8);
    };

    const drawGrid = (t: number) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.7;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.06)";
      ctx.lineWidth = 1;
      const spacing = subtle ? 56 : 48;
      const offset = (t * 0.015) % spacing;

      for (let x = -spacing; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, height);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawWave = (t: number) => {
      const baseY = height * (subtle ? 0.55 : 0.72);
      const amp = subtle ? 8 : 28;
      ctx.save();
      ctx.globalAlpha = opacity * 0.6;
      ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
      ctx.lineWidth = subtle ? 1 : 2;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y =
          baseY +
          Math.sin(x * 0.012 + t * 0.018) * amp +
          Math.sin(x * 0.004 + t * 0.009) * (amp * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawBars = (t: number) => {
      const barW = width / bars.length;
      const maxH = height * (subtle ? 0.35 : 0.22);
      ctx.save();
      ctx.globalAlpha = opacity * 0.5;
      for (let i = 0; i < bars.length; i++) {
        const phase = t * 0.01 + i * 0.15;
        const h = maxH * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(phase)) * bars[i]);
        const x = i * barW;
        const grad = ctx.createLinearGradient(0, height - h, 0, height);
        grad.addColorStop(0, "rgba(59, 130, 246, 0.4)");
        grad.addColorStop(1, "rgba(6, 182, 212, 0.04)");
        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, height - h, Math.max(barW - 2, 1), h);
      }
      ctx.restore();
    };

    const drawNetwork = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.pulse += 0.02;
      }

      const linkDist = Math.min(width, height) * (subtle ? 0.22 : 0.14);
      ctx.save();
      ctx.globalAlpha = opacity * 0.55;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * (subtle ? 0.2 : 0.35);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${(subtle ? 0.2 : 0.35) + glow * 0.2})`;
        ctx.fill();
      }
      ctx.restore();
    };

    const render = () => {
      frame++;
      ctx.fillStyle = "#0a0f1c";
      ctx.fillRect(0, 0, width, height);

      drawGrid(frame);
      drawBars(frame);
      drawWave(frame);
      drawNetwork();

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [subtle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-90"
      aria-hidden
    />
  );
}
