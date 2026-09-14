const PATHS = {
  search: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",

  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",

  compare: "M7 3v18M17 3v18M3 7h8M13 17h8",

  spark: "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z",

  user: "M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",

  arrow: "M5 12h14M13 6l6 6-6 6",

  check: "M5 13l4 4L19 7",

  menu: "M4 6h16M4 12h16M4 18h16",

  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",

  chart: "M4 19V5M4 19h16M8 16v-5M12 16V7M16 16v-9",

  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
};

export default function Icon({ name = "grid", size = 20, className = "" }) {
  const path = PATHS[name] || PATHS.grid;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
