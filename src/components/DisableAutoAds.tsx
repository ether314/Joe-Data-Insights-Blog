"use client";

import { useEffect } from "react";

/** Hide Auto Ads on thin error pages without removing the global AdSense snippet. */
export function DisableAutoAds() {
  useEffect(() => {
    document.body.classList.add("adsense-thin-page");
    return () => {
      document.body.classList.remove("adsense-thin-page");
    };
  }, []);
  return null;
}
