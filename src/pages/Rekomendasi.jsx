import { useState } from "react"
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import {
  FaChartLine, FaPepperHot, FaExclamationTriangle,
  FaCheckCircle, FaSync
} from "react-icons/fa"
import { GiCorn } from "react-icons/gi"
import { Bean } from "lucide-react"
import Navbar from "../components/Navbar"
import { FaMagnifyingGlass } from "react-icons/fa6"

const COMMODITY_COLORS = {
  jagung:  "#f59e0b",
  cabai:   "#ef4444",
  kedelai: "#22c55e",
}

const COMMODITY_LABELS = {
  jagung:  "Jagung",
  cabai:   "Cabai",
  kedelai: "Kedelai",
}

const COMMODITY_ICONS = {
  jagung:  <GiCorn className="inline mr-1" />,
  cabai:   <FaPepperHot className="inline mr-1" />,
  kedelai: <Bean size={14} className="inline mr-1" />,
}

const HARVEST_MONTHS = {
  cabai:   3,
  jagung:  4,
  kedelai: 4,
}

const tooltipStyle = {
  backgroundColor: "rgba(10, 15, 30, 0.97)",
  borderColor:     "rgba(255,255,255,0.08)",
  color:           "#f3f4f6",
  borderRadius:    "0.75rem",
  padding:         "12px",
  boxShadow:       "0 8px 32px rgba(0,0,0,0.4)",
}

const formatCurrency = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(v)

const cardStyle = "bg-white/5 border border-white/10 shadow-lg rounded-2xl p-6"

function getMonthLabel(offsetMonths) {
  const d = new Date()
  d.setMonth(d.getMonth() + offsetMonths)
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" })
}

// ✅ Sort berdasarkan month_offset biar X axis tidak acak
function buildPostHarvestData(models, key) {
  const labelMap = new Map()

  models.forEach(m => {
    ;(m.harvest_projection || []).forEach(p => {
      if (!labelMap.has(p.label)) {
        labelMap.set(p.label, { label: p.label, month_offset: p.month_offset })
      }
    })
  })

  const allLabels = Array.from(labelMap.values())
    .sort((a, b) => a.month_offset - b.month_offset)
    .map(x => x.label)

  return allLabels.map(label => {
    const point = { label }
    models.forEach(m => {
      const found = (m.harvest_projection || []).find(p => p.label === label)
      point[m.commodity]           = found ? found[key] : null
      point[`${m.commodity}_meta`] = found || null
    })
    return point
  })
}

function HarvestChart({ models }) {
  if (!models || models.length === 0) return null
  const hasProjection = models.some(m => (m.harvest_projection || []).length > 0)
  if (!hasProjection) return null

  const priceData  = buildPostHarvestData(models, "projected_price")
  const incomeData = buildPostHarvestData(models, "projected_income")

  // Custom dot: titik panen lebih besar + ring glow
  const CustomDot = (commodity) => (props) => {
    const { cx, cy, payload } = props
    const meta = payload[`${commodity}_meta`]
    if (!meta || payload[commodity] == null) return null
    const isHarvest = meta.is_harvest
    return (
      <g key={`dot-${commodity}-${payload.label}`}>
        {isHarvest && (
          <circle cx={cx} cy={cy} r={18}
            fill={COMMODITY_COLORS[commodity] + "20"}
            stroke={COMMODITY_COLORS[commodity] + "60"}
            strokeWidth={1}
          />
        )}
        <circle
          cx={cx} cy={cy}
          r={isHarvest ? 9 : 5}
          fill={COMMODITY_COLORS[commodity]}
          stroke={isHarvest ? "#fff" : COMMODITY_COLORS[commodity] + "80"}
          strokeWidth={isHarvest ? 2.5 : 1}
        />
      </g>
    )
  }

  // Label nilai di atas tiap titik
  const CustomLabel = (commodity, formatter) => (props) => {
    const { x, y, value } = props
    if (value == null) return null
    return (
      <text
        x={x} y={y - 14}
        textAnchor="middle"
        fill={COMMODITY_COLORS[commodity]}
        fontSize={10}
        fontWeight={600}
      >
        {formatter(value)}
      </text>
    )
  }

  // Tooltip informatif
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null
    const validPayload = payload.filter(p => p.value != null)
    if (!validPayload.length) return null

    return (
      <div style={tooltipStyle} className="min-w-[180px]">
        <p className="text-white/50 text-xs mb-3 font-medium border-b border-white/10 pb-2">
          📅 {label}
        </p>
        {validPayload.map((p) => {
          const commodity = p.dataKey
          const isHarvest = priceData.find(d => d.label === label)?.[`${commodity}_meta`]?.is_harvest
          const pctChange = priceData.find(d => d.label === label)?.[`${commodity}_meta`]?.price_change_pct

          return (
            <div key={commodity} className="mb-2 last:mb-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: COMMODITY_COLORS[commodity] }} />
                <span style={{ color: COMMODITY_COLORS[commodity] }} className="font-semibold text-sm">
                  {COMMODITY_LABELS[commodity]}
                </span>
                {isHarvest && (
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/60 ml-auto">
                    🌾 Panen
                  </span>
                )}
              </div>
              <p className="text-white text-sm pl-4">
                {typeof p.value === "number" && p.value > 100_000
                  ? formatCurrency(p.value)
                  : `Rp ${p.value?.toLocaleString("id-ID")}/kg`}
                {pctChange != null && pctChange !== 0 && (
                  <span className={`ml-2 text-xs ${pctChange > 0 ? "text-green-400" : "text-red-400"}`}>
                    {pctChange > 0 ? "▲" : "▼"} {Math.abs(pctChange)}%
                  </span>
                )}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  const sharedProps = (commodity, formatter) => ({
    type:         "monotone",
    dataKey:      commodity,
    stroke:       COMMODITY_COLORS[commodity] || "#888",
    strokeWidth:  2.5,
    dot:          CustomDot(commodity),
    activeDot:    { r: 10, strokeWidth: 2, stroke: "#fff" },
    connectNulls: false,
    label:        CustomLabel(commodity, formatter),
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Grafik Proyeksi Harga */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-1">
          <FaChartLine className="text-amber-400" />
          <h4 className="text-white font-semibold">Proyeksi Harga Jual</h4>
        </div>
        <p className="text-white/40 text-xs mb-1">
          Perkiraan harga per kg saat panen dan 2 bulan setelahnya
        </p>
        <div className="flex items-center gap-4 mb-5">
          <span className="flex items-center gap-1.5 text-white/30 text-xs">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-white/60 bg-white/10" />
            Bulan panen
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={priceData} margin={{ top: 28, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}rb` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(val) => (
                <span style={{ color: COMMODITY_COLORS[val], fontSize: 12 }}>
                  {COMMODITY_LABELS[val] || val}
                </span>
              )}
            />
            {models.map((m) => (
              <Line
                key={m.commodity}
                {...sharedProps(m.commodity, (v) => `${(v / 1000).toFixed(0)}rb`)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Proyeksi Pendapatan */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-1">
          <FaChartLine className="text-emerald-400" />
          <h4 className="text-white font-semibold">Proyeksi Pendapatan Jual</h4>
        </div>
        <p className="text-white/40 text-xs mb-1">
          Perkiraan pendapatan jika dijual saat panen atau ditahan 1–2 bulan
        </p>
        <div className="flex items-center gap-4 mb-5">
          <span className="flex items-center gap-1.5 text-white/30 text-xs">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-white/60 bg-white/10" />
            Bulan panen
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={incomeData} margin={{ top: 28, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt`
                : v >= 1000 ? `${(v / 1000).toFixed(0)}rb` : v
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(val) => (
                <span style={{ color: COMMODITY_COLORS[val], fontSize: 12 }}>
                  {COMMODITY_LABELS[val] || val}
                </span>
              )}
            />
            {models.map((m) => (
              <Line
                key={m.commodity}
                {...sharedProps(m.commodity, (v) =>
                  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt`
                  : `${(v / 1000).toFixed(0)}rb`
                )}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

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

const defaultInputs = {
  luas_lahan: "", stok_pupuk: "", pekerjaan_sampingan: "",
  kekurangan_pangan: "", jumlah_tanggungan: "",
}

export default function RekomendasiPage() {
  const [inputs,  setInputs]  = useState(defaultInputs)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleChange = (e) => setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const allFilled = Object.values(inputs).every(v => v !== "")

  const handleSubmit = async () => {
    if (!allFilled) { setError("Mohon lengkapi semua pilihan."); return }
    setLoading(true); setResult(null); setError(null)
    try {
      const response = await fetch("http://localhost:8000/api/recommendation", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(inputs),
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const data = await response.json()
      setResult({
        recommendation:     data.recommendation,
        commodities:        data.commodities,
        econReasons:        data.reason              || [],
        foodReasons:        data.food_reasons        || [],
        sufficiencyReasons: data.sufficiency_reasons || [],
        conclusion:         data.conclusion,
        marketContext:      data.market_context,
        models:             data.models              || [],
        targetIncome:       data.target_income       || 0,
        tanggunganLabel:    data.tanggungan_label     || "",
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const row1 = [
    { name: "luas_lahan", label: "Luas Lahan", options: [
      { value: "sangat_kecil", label: "Sangat Kecil (<0.1 ha)" },
      { value: "kecil",        label: "Kecil (0.1 - 0.5 ha)" },
      { value: "sedang",       label: "Sedang (0.5 - 1 ha)" },
      { value: "besar",        label: "Besar (>1 ha)" },
    ]},
    { name: "stok_pupuk", label: "Stok Pupuk", options: [
      { value: "tidak_ada", label: "Tidak Ada" },
      { value: "sedikit",   label: "Sedikit" },
      { value: "cukup",     label: "Cukup" },
      { value: "banyak",    label: "Banyak" },
    ]},
    { name: "pekerjaan_sampingan", label: "Pekerjaan Sampingan", options: [
      { value: "ada",       label: "Ada" },
      { value: "tidak_ada", label: "Tidak Ada" },
    ]},
  ]

  const row2 = [
    { name: "kekurangan_pangan", label: "Frekuensi Kekurangan Pangan", options: [
      { value: "tidak_pernah", label: "Tidak Pernah" },
      { value: "jarang",       label: "Jarang" },
      { value: "kadang",       label: "Kadang-kadang" },
      { value: "sering",       label: "Sering" },
    ]},
    { name: "jumlah_tanggungan", label: "Jumlah Tanggungan Keluarga", options: [
      { value: "satu_dua",   label: "1–2 orang" },
      { value: "tiga_empat", label: "3–4 orang" },
      { value: "lima_lebih", label: "5 orang atau lebih" },
    ]},
  ]

  const isTumpangsari   = result?.models?.length > 1
  const totalIncome     = result?.models?.reduce((s, m) => s + (m.income?.value || 0), 0) || 0
  const targetIncome    = result?.targetIncome || 0

  const allReasons = [
    ...(result?.sufficiencyReasons || []),
    ...(result?.foodReasons        || []),
    ...(result?.econReasons        || []),
  ]

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
                        borderColor:     (COMMODITY_COLORS[c] || "#888") + "60",
                        color:           COMMODITY_COLORS[c] || "#888",
                        backgroundColor: (COMMODITY_COLORS[c] || "#888") + "15",
                      }}>
                      {COMMODITY_ICONS[c]}
                      {COMMODITY_LABELS[c] || c}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{result.conclusion}</p>
            </div>

            {/* Grafik Proyeksi Pasca Panen */}
            <HarvestChart models={result.models} />

            {/* Card per Komoditas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.models.map((m) => (
                <div key={m.commodity} className={cardStyle}>
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ color: COMMODITY_COLORS[m.commodity] || "#888" }}>
                      {COMMODITY_ICONS[m.commodity]}
                    </span>
                    <h4 className="text-white font-semibold text-base">
                      {COMMODITY_LABELS[m.commodity] || m.commodity}
                    </h4>
                    <span className="ml-auto text-xs text-white/30">
                      Panen ~{getMonthLabel(HARVEST_MONTHS[m.commodity] || 4)}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <div className="flex-1 bg-white/5 rounded-xl p-4">
                      <p className="text-white/40 text-xs mb-1">Estimasi Produksi</p>
                      <p className="text-white font-bold text-lg">
                        {m.production?.value?.toLocaleString("id-ID")}
                        <span className="text-white/40 text-xs font-normal ml-1">{m.production?.unit}</span>
                      </p>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl p-4">
                      <p className="text-white/40 text-xs mb-1">Estimasi Pendapatan</p>
                      <p className="text-white font-bold text-lg">
                        {formatCurrency(m.income?.value || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {m.price_summary?.avg_price > 0 && (
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-0.5">Harga Pasar</p>
                        <p className="text-white font-semibold text-sm">
                          Rp {m.price_summary.avg_price?.toLocaleString("id-ID")}/kg
                        </p>
                        <p className="text-white/30 text-xs">rata-rata 7 hari</p>
                      </div>
                    )}
                    {m.price_summary?.trend && (
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-0.5">Tren Harga</p>
                        <p className={`font-semibold text-sm capitalize ${
                          m.price_summary.trend === "naik"  ? "text-green-400" :
                          m.price_summary.trend === "turun" ? "text-red-400"   : "text-yellow-400"
                        }`}>
                          {m.price_summary.trend === "naik"  ? "📈 Naik" :
                           m.price_summary.trend === "turun" ? "📉 Turun" : "➡️ Stabil"}
                          {m.price_summary.trend !== "stabil" && ` ${m.price_summary.pct_change}%`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Akumulasi tumpangsari */}
            {isTumpangsari && (
              <div className={`${cardStyle} flex items-center justify-between gap-4`}>
                <div>
                  <p className="text-white/50 text-sm mb-1">Total Pendapatan Tumpangsari</p>
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
                </div>
                <div className={`text-sm px-4 py-2 rounded-xl font-semibold ${
                  totalIncome >= targetIncome
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}>
                  {totalIncome >= targetIncome ? "✅ Mencukupi" : "⚠️ Belum Mencukupi"}
                </div>
              </div>
            )}

            {/* Akumulasi mono */}
            {!isTumpangsari && result.models[0] && (
              <div className={`${cardStyle} flex items-center justify-between gap-4`}>
                <div>
                  <p className="text-white/50 text-sm mb-1">Estimasi Pendapatan Panen</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(result.models[0].income?.value || 0)}
                  </p>
                </div>
                <div className={`text-sm px-4 py-2 rounded-xl font-semibold ${
                  result.models[0].meets_target
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}>
                  {result.models[0].meets_target ? "✅ Mencukupi" : "⚠️ Belum Mencukupi"}
                </div>
              </div>
            )}

            {/* Saran */}
            <div className={cardStyle}>
              <h4 className="text-white font-semibold mb-4">Saran untuk Kamu</h4>
              <div className="space-y-3">
                {allReasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-white/70 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

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