interface CottonCandyProps {
  size?: number;
  className?: string;
}

export default function CottonCandy({ size = 36, className }: CottonCandyProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 36 36"
      style={{ animation: 'cotton-spin 6s ease-in-out infinite' }}
    >
      <ellipse cx="18" cy="14" rx="12" ry="10" fill="#F9A8D4" opacity="0.8" />
      <ellipse cx="14" cy="12" rx="8" ry="7" fill="#C4B5FD" opacity="0.6" />
      <ellipse cx="22" cy="11" rx="7" ry="6" fill="#93C5FD" opacity="0.5" />
      <ellipse cx="18" cy="16" rx="9" ry="7" fill="#FDBA74" opacity="0.4" />
      <rect x="17" y="22" width="2.5" height="12" rx="1.2" fill="#DEB887" />
    </svg>
  );
}
