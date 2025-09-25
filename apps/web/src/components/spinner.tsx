import React from "react"

type SpinnerProps = {
  size?: "xs" | "sm" | "md" | "lg" | number
  className?: string
  ariaLabel?: string
}

/**
 * Simple accessible spinner.
 * - size: preset string or numeric pixel size
 * - className: extra tailwind / class names
 * - ariaLabel: accessibility label (default "Loading")
 */
export default function Spinner({
  size = "md",
  className = "",
  ariaLabel = "Loading",
}: SpinnerProps) {
  const sizePx =
    typeof size === "number"
      ? size
      : size === "xs"
      ? 12
      : size === "sm"
      ? 14
      : size === "md"
      ? 18
      : size === "lg"
      ? 24
      : 18

  const stroke = Math.max(2, Math.round(sizePx / 6))

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        className="animate-spin"
        width={sizePx}
        height={sizePx}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {/* Faint circular track */}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth={stroke}
        />
        {/* Leading arc */}
        <path
          d="M21 12a9 9 0 00-9-9"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}