"use client";

import { useEffect } from "react";

export function FullscreenShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.layout = "fullscreen";
    return () => {
      delete document.documentElement.dataset.layout;
    };
  }, []);

  return <>{children}</>;
}
