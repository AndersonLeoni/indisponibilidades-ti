const paths = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  alert: 'M12 3l10 18H2L12 3z M12 10v5 M12 18h.01',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14z M21 21l-5-5',
  plus: 'M12 5v14 M5 12h14',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18z M12 7v5l3 2',
  timer: 'M10 2h4 M12 14l3-3 M12 6a8 8 0 100 16 8 8 0 000-16z',
  pulse: 'M3 12h4l3-8 4 16 3-8h4',
  checkCircle: 'M12 3a9 9 0 100 18 9 9 0 000-18z M8 12l3 3 5-6',
  check: 'M5 13l4 4L19 7',
  bell: 'M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8 M10 21h4',
  wave: 'M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
