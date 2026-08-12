"use client";

import { useEffect } from "react";

function scrollToCurrentFragment() {
  const hash = window.location.hash.slice(1);

  if (!hash) return;

  let id: string;

  try {
    id = decodeURIComponent(hash);
  } catch {
    return;
  }

  const target = document.getElementById(id);

  if (!target) return;

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  target.scrollIntoView({ block: "start" });
  root.style.scrollBehavior = previousScrollBehavior;
}

export function FragmentNavigationSync() {
  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!cancelled) scrollToCurrentFragment();
      });
    };

    const syncAfterFontsLoad = () => {
      void document.fonts.ready.then(sync);
    };

    if (document.readyState === "complete") {
      syncAfterFontsLoad();
    } else {
      window.addEventListener("load", syncAfterFontsLoad, { once: true });
    }

    window.addEventListener("hashchange", sync);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", syncAfterFontsLoad);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  return null;
}
