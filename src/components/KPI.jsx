import { TrendingUp, TrendingDown } from "lucide-react"

export default function KPICard({ icon, title, value, unit, trend, trendPositive }) {
  return (
    <div className="
      group relative overflow-hidden
      bg-white dark:bg-white/5
      border-l-4 border-l-[#87a96b] border border-[#87a96b]/25 dark:border-white/10
      rounded-2xl p-4 shadow-sm dark:shadow-none
      hover:border-l-[#87a96b] hover:border-[#87a96b]/40 dark:hover:border-white/20
      hover:shadow-[0_4px_16px_rgba(135,169,107,0.2)] dark:hover:shadow-green-500/5
      transition-all duration-300
    ">
      <div className="absolute inset-0 bg-gradient-to-br from-[#87a96b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 space-y-1">
        <div className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <p className="text-sm font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
            {value}
          </span>
          <span className="text-sm font-medium text-gray-400 dark:text-white/40">
            {unit}
          </span>
        </div>
      </div>
    </div>
  )
}
