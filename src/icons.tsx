interface IconProps {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Crosshair = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="7.2" />
    <path d="M12 1.8v4M12 18.2v4M1.8 12h4M18.2 12h4" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const Feed = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <ellipse cx="12" cy="5.4" rx="7.4" ry="2.9" />
    <path d="M4.6 5.4v6.3c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V5.4" />
    <path d="M4.6 11.7V18c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9v-6.3" />
  </svg>
);

export const Forge = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3.5 6.5h6l2 2.6h9" />
    <path d="M3.5 12h9l2 2.6h6" />
    <path d="M3.5 17.5h4l2-2.6h11" />
    <circle cx="6" cy="6.5" r="1.3" />
    <circle cx="17" cy="12" r="1.3" />
    <circle cx="8" cy="17.5" r="1.3" />
  </svg>
);

export const Chip = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="1.2" />
    <rect x="10" y="10" width="4" height="4" />
    <path d="M9 2.8v3.7M15 2.8v3.7M9 17.5v3.7M15 17.5v3.7M2.8 9h3.7M2.8 15h3.7M17.5 9h3.7M17.5 15h3.7" />
  </svg>
);

export const Bolt = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M13.2 2.6 5.4 13.4h5l-1.6 8 8-11h-5.2l1.6-7.8z" />
  </svg>
);

export const Scale = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 4v16M8 20h8" />
    <path d="M4 7.2 12 5l8 2.2" />
    <path d="M4 7.2 1.9 12.6a3.1 3.1 0 0 0 4.2 0L4 7.2zM20 7.2l-2.1 5.4a3.1 3.1 0 0 0 4.2 0L20 7.2z" />
  </svg>
);

export const Ledger = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5.5 3.5h11.4a1.6 1.6 0 0 1 1.6 1.6v13.8a1.6 1.6 0 0 1-1.6 1.6H5.5z" />
    <path d="M5.5 3.5v17" />
    <path d="M9.3 8h6M9.3 12h6M9.3 16h3.6" />
  </svg>
);

export const Pulse = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2.5 12h4l2.5-6.5 4.5 13 2.5-6.5h5.5" />
  </svg>
);

export const Shield = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 2.8 4.6 5.5v6.1c0 4.6 3 8.1 7.4 9.6 4.4-1.5 7.4-5 7.4-9.6V5.5L12 2.8z" />
    <path d="M8.8 12l2.2 2.2 4.2-4.4" />
  </svg>
);

export const Target = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const TrendUp = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 17.5 9.5 11l4 4L21 6.8" />
    <path d="M15.5 6.8H21v5.5" />
  </svg>
);

export const Crowd = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="8" cy="8.4" r="2.7" />
    <circle cx="16.4" cy="9.6" r="2.2" />
    <path d="M3.2 19.2c.5-3.4 2.5-5.3 4.8-5.3s4.3 1.9 4.8 5.3" />
    <path d="M14.6 19.2c.4-2.7 1.8-4.2 3.6-4.2 1.4 0 2.6.9 3.3 2.5" />
  </svg>
);

export const Radar = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.8" />
    <circle cx="12" cy="12" r="4.9" opacity="0.6" />
    <path d="M12 12 19 5.6" />
    <circle cx="15.2" cy="14.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
