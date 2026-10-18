"use client";

import { useEffect } from "react";

function setupReveal(): () => void {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return () => {};

  // Mark what is already on screen before hiding the rest, so nothing flickers
  items
    .filter((el) => el.getBoundingClientRect().top < window.innerHeight)
    .forEach((el) => el.classList.add("is-visible"));
  document.documentElement.classList.add("motion-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  items
    .filter((el) => !el.classList.contains("is-visible"))
    .forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

function setupSpotlight(): () => void {
  let frame = 0;
  const onMove = (event: PointerEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>(
      "[data-spotlight]",
    );
    if (!target || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    document.removeEventListener("pointermove", onMove);
    cancelAnimationFrame(frame);
  };
}

export function MotionEffects() {
  useEffect(() => {
    const teardownReveal = setupReveal();
    const teardownSpotlight = setupSpotlight();
    return () => {
      teardownReveal();
      teardownSpotlight();
    };
  }, []);

  return null;
}
