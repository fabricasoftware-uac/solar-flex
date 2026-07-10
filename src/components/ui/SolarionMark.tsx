interface SolarionMarkProps {
  className?: string;
}

/** Isotipo de Solarion: cluster orgánico de gotas (GuiaMarca.pdf). */
export function SolarionMark({ className }: SolarionMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="27" cy="40" rx="11" ry="10" />
      <ellipse cx="23" cy="20" rx="7" ry="6" transform="rotate(-18 23 20)" />
      <ellipse cx="40" cy="15" rx="5" ry="4.4" />
      <ellipse cx="45" cy="29" rx="6" ry="5.4" />
      <ellipse cx="43" cy="45" rx="4.4" ry="4" />
      <circle cx="54" cy="20" r="2.8" />
    </svg>
  );
}
