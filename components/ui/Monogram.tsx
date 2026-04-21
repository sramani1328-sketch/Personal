export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-display font-bold text-base select-none ${className}`}
      aria-label="Shoaib Ramani"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
        <rect x="0.5" y="0.5" width="35" height="35" rx="6" fill="#1B2A4A" stroke="#C9A84C" />
        <text
          x="50%"
          y="56%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fontSize="16"
          fill="#C9A84C"
        >
          SR
        </text>
      </svg>
    </span>
  );
}
