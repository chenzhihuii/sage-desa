import { useState } from "react"
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import {
  FaChartLine, FaPepperHot, FaExclamationTriangle,
  FaCheckCircle, FaSync, FaChevronDown
} from "react-icons/fa"
import { GiCorn } from "react-icons/gi"
import { Bean } from "lucide-react"
import Navbar from "../components/Navbar"
import { FaMagnifyingGlass } from "react-icons/fa6"

const COMMODITY_COLORS = {
  jagung: "#f59e0b",
  cabai: "#ef4444",
  kedelai: "#22c55e",
}

const COMMODITY_LABELS = {
  jagung: "Jagung",
  cabai: "Cabai",
  kedelai: "Kedelai",
}

const COMMODITY_ICONS = {
  jagung: <GiCorn className="inline mr-1" />,
  cabai: <FaPepperHot className="inline mr-1" />,
  kedelai: <Bean size={14} className="inline mr-1" />,
}

const TAG_ICONS = {
  pendapatan: "💰",
  strategi_jual: "📦",
  pengolahan: "🛠️",
  tumpangsari: "🌱",
  risiko: "⚠️",
}

const TAG_LABELS = {
  pendapatan: "Pendapatan",
  strategi_jual: "Strategi Jual",
  pengolahan: "Pengolahan",
  tumpangsari: "Tumpangsari",
  risiko: "Risiko",
}

const TAG_COLORS = {
  pendapatan: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#10b981" },
  strategi_jual: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "#3b82f6" },
  pengolahan: { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", text: "#a855f7" },
  tumpangsari: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "#22c55e" },
  risiko: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "#f59e0b" },
}

const tooltipStyle = {
  backgroundColor: "rgba(10, 15, 30, 0.97)",
  borderColor: "rgba(255,255,255,0.08)",
  color: "#f3f4f6",
  borderRadius: "0.75rem",
  padding: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
}

const formatCurrency = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(v)

const cardStyle = "bg-white/5 border border-white/10 shadow-lg rounded-2xl p-6"

function CommodityDropdown({ models, selected, onSelect }) {
  if (models.length <= 1) return null
  return (
    <div className="relative shrink-0">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-white/10 border border-white/20 text-white text-sm
          rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/30"
        style={{ colorScheme: "dark" }}
      >
        {models.map(m => (
          <option key={m.commodity} value={m.commodity} className="bg-gray-900">
            {COMMODITY_LABELS[m.commodity]}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-xs pointer-events-none" />
    </div>
  )
}

function PriceForecastChart({ models }) {
  const isTumpangsari = models.length > 1
  const [selected, setSelected] = useState(models[0]?.commodity || "")

  if (!models || models.length === 0) return null

  const activeModel = models.find(m => m.commodity === selected) || models[0]
  const isCabai = activeModel.commodity === "cabai"
  const color = COMMODITY_COLORS[activeModel.commodity] || "#888"
  const forecast = activeModel.price_forecast || {}

  const chartData = isCabai
    ? (forecast.daily_forecast || []).map(p => ({
      label: p.label,
      value: p.projected_price,
      pct_change: p.price_change_pct,
    }))
    : (forecast.monthly_forecast || []).map(p => ({
      label: p.label,
      value: p.projected_price,
      pct_change: p.price_change_pct,
    }))

  if (chartData.length === 0) return null

  const values = chartData.map(d => d.value).filter(Boolean)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const pad = (maxVal - minVal) * 0.3 || maxVal * 0.02
  const yDomain = [Math.floor(minVal - pad), Math.ceil(maxVal + pad)]

  const trend = forecast.trend || "stabil"
  const riskLevel = forecast.risk_level || "rendah"
  const trendColor = trend === "naik" ? "#22c55e" : trend === "turun" ? "#ef4444" : "#94a3b8"
  const trendIcon = trend === "naik" ? "📈" : trend === "turun" ? "📉" : "➡️"
  const riskColor = riskLevel === "tinggi" ? "#ef4444" : riskLevel === "sedang" ? "#f59e0b" : "#22c55e"

  const CustomDot = (props) => {
    const { cx, cy } = props
    if (cx == null || cy == null) return null
    return (
      <g key={`pdot-${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={4} fill={color} stroke={color + "80"} strokeWidth={1} />
      </g>
    )
  }

  const CustomLabel = (props) => {
    const { x, y, value } = props
    if (value == null) return null
    const fmt = value.toLocaleString("id-ID")
    return (
      <text x={x} y={y - 10} textAnchor="middle"
        fill={color} fontSize={10} fontWeight={600}>{fmt}</text>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const pct = payload[0]?.payload?.pct_change
    return (
      <div style={tooltipStyle} className="min-w-[150px]">
        <p className="text-white/50 text-xs mb-2 pb-2 border-b border-white/10">
          {isCabai ? `🌶️ ${label}` : `📅 ${label}`}
        </p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span style={{ color }} className="font-semibold text-sm">
            {COMMODITY_LABELS[activeModel.commodity]}
          </span>
        </div>
        <p className="text-white text-sm pl-4">
          Rp {payload[0].value.toLocaleString("id-ID")}/kg
          {pct != null && pct !== 0 && (
            <span className={`ml-2 text-xs ${pct > 0 ? "text-green-400" : "text-red-400"}`}>
              {pct > 0 ? "▲" : "▼"} {Math.abs(pct)}%
            </span>
          )}
        </p>
      </div>
    )
  }

  return (
    <div className={cardStyle}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaChartLine style={{ color }} />
            <h4 className="text-white font-semibold">
              {isCabai
                ? "Prediksi Harga Cabai (7 Hari)"
                : `Prediksi Harga ${COMMODITY_LABELS[activeModel.commodity]} (4 Bulan)`}
            </h4>
          </div>
          <p className="text-white/40 text-xs">
            {isCabai
              ? "Prediksi fluktuasi harga cabai 7 hari ke depan berdasarkan data historis"
              : "Prediksi tren harga pasar 4 bulan ke depan berdasarkan data historis"}
          </p>
        </div>
        {isTumpangsari && (
          <CommodityDropdown models={models} selected={selected} onSelect={setSelected} />
        )}
      </div>

      <div className="flex items-center gap-3 mt-3 mb-5">
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ backgroundColor: trendColor + "20", color: trendColor }}>
          {trendIcon} Tren {trend}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ backgroundColor: riskColor + "20", color: riskColor }}>
          Risiko {riskLevel}
        </span>
        <span className="text-white/30 text-xs ml-auto">
          Harga dasar: Rp {(forecast.base_price || 0).toLocaleString("id-ID")}/kg
        </span>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 24, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.2)"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            tickLine={false} axisLine={false}
            domain={yDomain}
            label={{ value: 'Rp', angle: -90, position: 'insideLeft', offset: 10, style: { fill: 'rgba(255,255,255,0.4)', fontSize: 12 } }}
            tickFormatter={(v) => v.toLocaleString("id-ID")}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={CustomDot}
            activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }}
            label={<CustomLabel />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="flex-1 min-w-[160px]">
      <label className="block text-xs text-white/60 mb-1.5 font-medium tracking-wide uppercase">
        {label}
      </label>
      <select
        name={name} value={value} onChange={onChange}
        className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium
          focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 cursor-pointer
          ${value === ""
            ? "bg-gray-800/80 border-gray-600 text-white/30"
            : "bg-gray-800/80 border-emerald-500 text-white"}`}
        style={{ colorScheme: "dark" }}
      >
        <option value="" disabled className="bg-gray-900 text-white/30">— Pilih {label} —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── Helper: normalisasi satu item reason ──────────────────────────────────────
function normalizeReason(r) {
  if (!r) return null
  if (typeof r === "string") return { tag: "info", text: r }
  if (typeof r === "object" && typeof r.text === "string") return r
  return null
}

const defaultInputs = {
  luas_lahan: "", stok_pupuk: "", pekerjaan_sampingan: "",
  kekurangan_pangan: "", jumlah_tanggungan: "",
}

export default function RekomendasiPage() {
  const [inputs, setInputs] = useState(defaultInputs)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const allFilled = Object.values(inputs).every(v => v !== "")

  const handleSubmit = async () => {
    if (!allFilled) { setError("Mohon lengkapi semua pilihan."); return }
    setLoading(true); setResult(null); setError(null)
    try {
      const response = await fetch("http://localhost:8000/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const data = await response.json()

      // Kumpulkan semua reasons dari berbagai field, normalisasi jadi { tag, text }
      const allReasons = [
        ...(Array.isArray(data.reasons) ? data.reasons : []),
        ...(Array.isArray(data.reason) ? data.reason : []),
        ...(Array.isArray(data.food_reasons) ? data.food_reasons : []),
        ...(Array.isArray(data.sufficiency_reasons) ? data.sufficiency_reasons : []),
      ]
        .map(normalizeReason)
        .filter(r => r !== null && !r.text.includes("Ada sisa sekitar"))

      setResult({
        recommendation: data.recommendation,
        commodities: data.commodities,
        reasons: allReasons,
        conclusion: data.conclusion,
        marketContext: data.market_context,
        models: Array.isArray(data.models) ? data.models : [],
        targetIncome: data.target_income || 0,
        tanggunganLabel: data.tanggungan_label || "",
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const row1 = [
    {
      name: "luas_lahan", label: "Luas Lahan", options: [
        { value: "sangat_kecil", label: "Sangat Kecil (<0.1 ha)" },
        { value: "kecil", label: "Kecil (0.1 - 0.5 ha)" },
        { value: "sedang", label: "Sedang (0.5 - 1 ha)" },
        { value: "besar", label: "Besar (>1 ha)" },
      ]
    },
    {
      name: "stok_pupuk", label: "Stok Pupuk", options: [
        { value: "tidak_ada", label: "Tidak Ada" },
        { value: "sedikit", label: "Sedikit" },
        { value: "cukup", label: "Cukup" },
        { value: "banyak", label: "Banyak" },
      ]
    },
    {
      name: "pekerjaan_sampingan", label: "Pekerjaan Sampingan", options: [
        { value: "ada", label: "Ada" },
        { value: "tidak_ada", label: "Tidak Ada" },
      ]
    },
  ]

  const row2 = [
    {
      name: "kekurangan_pangan", label: "Frekuensi Kekurangan Pangan", options: [
        { value: "tidak_pernah", label: "Tidak Pernah" },
        { value: "jarang", label: "Jarang" },
        { value: "kadang", label: "Kadang-kadang" },
        { value: "sering", label: "Sering" },
      ]
    },
    {
      name: "jumlah_tanggungan", label: "Jumlah Tanggungan Keluarga", options: [
        { value: "satu_dua", label: "1–2 orang" },
        { value: "tiga_empat", label: "3–4 orang" },
        { value: "lima_lebih", label: "5 orang atau lebih" },
      ]
    },
  ]

  const isTumpangsari = result?.models?.length > 1
  const totalIncome = result?.models?.reduce((s, m) => s + (m.income?.value || 0), 0) || 0

  // Group reasons by tag untuk ditampilkan per seksi
  const groupedReasons = result?.reasons?.reduce((acc, r) => {
    const tag = r.tag || "info"
    if (!acc[tag]) acc[tag] = []
    acc[tag].push(r.text)
    return acc
  }, {}) || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 px-4 md:px-8 pb-12 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold pb-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">
            Rekomendasi Ketahanan Pangan
          </h1>
          <p className="text-white/50 text-sm md:text-base">
            Sistem Rekomendasi berbasis Deep Reinforcement Learning
          </p>
        </div>

        {/* Input Card */}
        <div className={cardStyle}>
          <div className="flex flex-wrap gap-3 mb-3">
            {row1.map((f) => (
              <SelectField key={f.name} label={f.label} name={f.name}
                value={inputs[f.name]} onChange={handleChange} options={f.options} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            {row2.map((f) => (
              <SelectField key={f.name} label={f.label} name={f.name}
                value={inputs[f.name]} onChange={handleChange} options={f.options} />
            ))}
            <div className="flex flex-col justify-end flex-1 min-w-[160px]">
              <button onClick={handleSubmit} disabled={loading || !allFilled}
                className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide text-white
                  transition-all duration-200 shadow-lg flex items-center justify-center gap-2
                  ${allFilled && !loading
                    ? "bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                    : "bg-gray-700 cursor-not-allowed opacity-50"}`}>
                {loading
                  ? <><FaSync className="animate-spin" />Memproses...</>
                  : <><FaMagnifyingGlass />Dapatkan Rekomendasi</>}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
              <FaExclamationTriangle /><span>{error}</span>
            </div>
          )}
          {!allFilled && !error && (
            <p className="text-white/30 text-xs mt-3 text-right">
              Lengkapi semua pilihan untuk mengaktifkan tombol rekomendasi
            </p>
          )}
        </div>

        {result && (
          <div className="space-y-6">

            {/* Header Rekomendasi */}
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-white/50 text-sm mb-1">Rekomendasi Tanaman</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-teal-400">
                    {result.recommendation}
                  </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {result.commodities.map((c) => (
                    <span key={c}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1"
                      style={{
                        borderColor: (COMMODITY_COLORS[c] || "#888") + "60",
                        color: COMMODITY_COLORS[c] || "#888",
                        backgroundColor: (COMMODITY_COLORS[c] || "#888") + "15",
                      }}>
                      <span>{COMMODITY_ICONS[c]}</span>
                      {COMMODITY_LABELS[c] || c}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{result.conclusion}</p>
            </div>

            {/* 2 Card Estimasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card Estimasi Produksi */}
              <div className={cardStyle}>
                <p className="text-white/50 text-sm mb-4">Estimasi Produksi</p>
                {!isTumpangsari ? (
                  <div>
                    <p className="text-5xl font-bold"
                      style={{ color: COMMODITY_COLORS[result.models[0].commodity] }}>
                      {result.models[0].production?.value ?? "-"}
                    </p>
                    <p className="text-white/40 text-sm mt-2">kwintal/ha</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.models.map(m => (
                      <div key={m.commodity} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium"
                          style={{ color: COMMODITY_COLORS[m.commodity] }}>
                          <span>{COMMODITY_ICONS[m.commodity]}</span>
                          {COMMODITY_LABELS[m.commodity]}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-white text-xl">
                            {m.production?.value ?? "-"}
                          </span>
                          <span className="text-white/40 text-xs ml-1">kwintal/ha</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Estimasi Pendapatan */}
              <div className={cardStyle}>
                <p className="text-white/50 text-sm mb-4">Estimasi Pendapatan</p>
                {!isTumpangsari ? (
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">
                      {formatCurrency(result.models[0].income?.value || 0)}
                    </p>
                    <p className="text-white/40 text-sm mt-2">per panen</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-4xl font-bold text-emerald-400">
                      {formatCurrency(totalIncome)}
                    </p>
                    <div className="flex gap-4 flex-wrap pt-1">
                      {result.models.map(m => (
                        <span key={m.commodity} className="text-xs">
                          <span style={{ color: COMMODITY_COLORS[m.commodity] }}
                            className="flex items-center gap-1">
                            <span>{COMMODITY_ICONS[m.commodity]}</span>
                            {COMMODITY_LABELS[m.commodity]}
                          </span>
                          <span className="text-white/50 mt-0.5 block">
                            {formatCurrency(m.income?.value || 0)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Grafik Prediksi Harga */}
            <PriceForecastChart models={result.models} />

            {/* Analisis & Saran — dikelompokkan per tag */}
            {result.reasons.length > 0 && (
              <div className={cardStyle}>
                <h4 className="text-white font-semibold mb-5">Analisis & Saran</h4>
                <div className="space-y-6">
                  {Object.entries(groupedReasons).map(([tag, texts]) => {
                    const colors = TAG_COLORS[tag] || TAG_COLORS["pendapatan"]
                    const icon = TAG_ICONS[tag] || "ℹ️"
                    const label = TAG_LABELS[tag] || tag
                    return (
                      <div key={tag}>
                        {/* Tag label */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={{
                              backgroundColor: colors.bg,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}>
                            {icon} {label}
                          </span>
                        </div>
                        {/* Reason items */}
                        <div className="space-y-2.5 pl-1">
                          {texts.map((text, i) => (
                            <div key={`${tag}-${i}`}
                              className="flex items-start gap-3 text-sm text-white/70
                                pb-2.5 border-b border-white/5 last:border-0 last:pb-0">
                              <FaCheckCircle className="mt-0.5 shrink-0" style={{ color: colors.text }} />
                              <span className="leading-relaxed">{text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Catatan */}
            <div className="bg-white/3 border border-white/8 rounded-xl px-5 py-3 flex items-center gap-3">
              <FaExclamationTriangle className="text-amber-400 shrink-0" />
              <p className="text-white/40 text-xs">
                Rekomendasi ini bersifat pendukung keputusan dan perlu disesuaikan dengan kondisi lapangan aktual.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
