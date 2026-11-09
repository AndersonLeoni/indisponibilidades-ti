import { Icon, type IconName } from './icons'
import { Sparkline } from './bars'

export function KpiCard({
  label,
  value,
  hint,
  gradient,
  darkText = false,
  icon,
  spark,
  delay = 0,
}: {
  label: string
  value: string
  hint: string
  gradient: string
  darkText?: boolean
  icon: IconName
  spark?: number[]
  delay?: number
}) {
  return (
    <div
      className={`animate-rise relative overflow-hidden rounded-2xl p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        darkText ? 'text-cvc-navy' : 'text-white'
      }`}
      style={{ backgroundImage: gradient, animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium opacity-90">{label}</p>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${darkText ? 'bg-white/40' : 'bg-white/20'}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold leading-none">{value}</p>
      <p className="mt-1.5 text-xs opacity-90">{hint}</p>
      {spark && spark.length > 1 && <Sparkline values={spark} />}
    </div>
  )
}
