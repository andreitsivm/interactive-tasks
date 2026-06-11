interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 440 440"
      width={size}
      height={size}
      role="img"
      aria-label="Interactive Tasks logo"
      className={className}
    >
      <rect
        width="440"
        height="440"
        rx="88"
        className="fill-[#1a1a2e] dark:fill-[#e8e8f0]"
      />
      <g transform="translate(220, 220)">
        <polygon
          points="0,-148 148,0 0,148 -148,0"
          fill="none"
          stroke="#e0573a"
          strokeWidth="13"
          strokeLinejoin="round"
        />
        <polygon points="0,-94 94,0 0,94 -94,0" fill="#e0573a" />
        <polygon
          points="0,-49 49,0 0,49 -49,0"
          className="fill-white dark:fill-[#1a1a2e]"
          opacity="0.93"
        />
        <circle cx="0" cy="0" r="20" fill="#e0573a" />
        <line
          x1="67"
          y1="-67"
          x2="108"
          y2="-108"
          stroke="#e0573a"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1="47"
          y1="-77"
          x2="76"
          y2="-121"
          stroke="#e0573a"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.28"
        />
        <line
          x1="67"
          y1="67"
          x2="108"
          y2="108"
          stroke="#e0573a"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1="47"
          y1="77"
          x2="76"
          y2="121"
          stroke="#e0573a"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.28"
        />
      </g>
    </svg>
  );
}
