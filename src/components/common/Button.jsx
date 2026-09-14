export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`admin-button admin-button-${variant} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
