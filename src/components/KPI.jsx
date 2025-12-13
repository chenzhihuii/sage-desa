import { TrendingUp, TrendingDown } from "lucide-react"

export default function KPICard({
  title,
  value,
  unit
}) {
  return (
    <div className="
      group relative overflow-hidden
      bg-gradient-to-br from-white/5 to-white/0 
      backdrop-blur-xl border border-white/10 
      rounded-2xl p-6 
      hover:border-white/20 hover:shadow-lg hover:shadow-green-500/5 
      transition-all duration-300
    ">
      
      {/* Background Gradient Halus saat Hover (Sesuai tema Homepage) */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 space-y-1">
        {/* Title */}
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
          {title}
        </p>

        {/* Value Section */}
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-4xl font-bold text-white tracking-tight drop-shadow-sm">
            {value}
          </span>
          <span className="text-sm font-medium text-white/40">
            {unit}
          </span>
        </div>
      </div>
    </div>
  )
}