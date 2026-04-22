"use client";
import { useEffect, useRef, useState } from "react";

export function Counter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  // Parse "$10M+" → prefix $, number 10, suffix M+
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? "";
  const isInt = Number.isInteger(target);

  // Start at the final value so nothing flickers if JS hasn't hydrated yet
  // or if the IntersectionObserver never fires.
  const [display, setDisplay] = useState<string>(value);
  const didAnimate = useRef(false);

  useEffect(() => {
    // If the value isn't parseable, just render it verbatim.
    if (!match) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion — keep final value, no animation.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    // Only animate once per mount.
    if (didAnimate.current) return;

    const animate = () => {
      didAnimate.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const n = target * eased;
        const rounded = isInt ? Math.round(n) : Math.round(n * 10) / 10;
        setDisplay(`${prefix}${rounded}${suffix}`);
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(`${prefix}${isInt ? target : target.toFixed(1)}${suffix}`);
      };
      requestAnimationFrame(tick);
    };

    // If IntersectionObserver isn't available, just animate immediately.
    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !didAnimate.current) {
            animate();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
    // Deps are primitives only — prevents effect from re-running every render.
  }, [value, duration, prefix, suffix, target, isInt]);

  return <span ref={ref}>{display}</span>;
}
