const PATHS = {
  search:
    "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",

  grid:
    "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",

  compare:
    "M7 3v18M17 3v18M3 7h8M13 17h8",

  spark:
    "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z",

  user:
    "M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",

  bookmark:
    "M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17l-6-3.5L6 21V4Z",

  lightbulb:
    "M9 18h6M10 22h4M8 14.5a7 7 0 1 1 8 0c-1.1.8-1.5 1.6-1.5 2.5h-5c0-.9-.4-1.7-1.5-2.5Z",

  star:
    "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",

  file:
    "M6 3h8l4 4v14H6V3ZM14 3v5h5M9 13h6M9 17h6",

  bell:
    "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",

  chart:
    "M4 19V5M4 19h16M8 16v-5M12 16V7M16 16v-9",

  crown:
    "M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7ZM6 19h12",

  settings:
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.5v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.5h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.7l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.5v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.5 1Z",

  arrow:
    "M5 12h14M13 6l6 6-6 6",

  check:
    "M5 13l4 4L19 7",

  menu:
    "M4 6h16M4 12h16M4 18h16",
};

export default function Icon({
  name = "grid",
  size = 20,
  className = "",
}) {
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