"use client";
import { useEffect, useRef, useState } from "react";

export function Counter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  // Parse "$10M+" → prefix $, number 10, suffix M+
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!started && entry.isIntersecting) {
          started = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const n = Math.round(target * eased * 10) / 10;
            const asInt = Number.isInteger(target) ? Math.round(n) : n;
            setDisplay(`${prefix}${asInt}${suffix}`);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [duration, match, prefix, suffix, target, value]);

  return <span ref={ref}>{display}</span>;
}
