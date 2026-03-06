import { useState } from "react"
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import {
  FaChartLine, FaPepperHot, FaExclamationTriangle,
  FaCheckCircle, FaArrowRight, FaSync
} from "react-icons/fa"
import { GiCorn, GiPeas } from "react-icons/gi"
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
  kedelai: <GiPeas className="inline mr-1" />,
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

function EstimasiChart({ models }) {
  if (!models || models.length === 0) return null

  const allProd   = models.map(m => m.production_projection || [])
  const maxLenProd = Math.max(...allProd.map(p => p.length))
  const prodLineData = Array.from({ length: maxLenProd }, (_, i) => {
    const point = { label: allProd[0]?.[i]?.label || `Bulan ${i + 1}` }
    models.forEach(m => {
      point[m.commodity] = m.production_projection?.[i]?.value || 0
    })
    return point
  })

  const allInc    = models.map(m => m.income_projection || [])
  const maxLenInc  = Math.max(...allInc.map(p => p.length))
  const incLineData = Array.from({ length: maxLenInc }, (_, i) => {
    const point = { label: allInc[0]?.[i]?.label || `Bulan ${i + 1}` }
    models.forEach(m => {
      point[m.commodity] = m.income_projection?.[i]?.value || 0
    })
    return point
  })

  const sharedLineProps = (commodity) => ({
    type:        "monotone",
    dataKey:     commodity,
    stroke:      COMMODITY_COLORS[commodity] || "#888",
    strokeWidth: 2.5,
    dot:         { r: 5, fill: COMMODITY_COLORS[commodity], strokeWidth: 0 },
    activeDot:   { r: 7 },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Line Chart Proyeksi Produksi */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-1">
          <FaChartLine className="text-amber-400" />
          <h4 className="text-white font-semibold">Proyeksi Produksi 4 Bulan</h4>
        </div>
        <p className="text-white/40 text-xs mb-5">
          Estimasi hasil panen dari masa tanam hingga panen penuh
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={prodLineData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}rb` : v} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(val, name) => [
                `${val?.toLocaleString("id-ID")} kwintal/ha`,
                COMMODITY_LABELS[name] || name
              ]}
            />
            <Legend
              formatter={(val) => COMMODITY_LABELS[val] || val}
              wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            {models.map((m) => (
              <Line key={m.commodity} {...sharedLineProps(m.commodity)} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart Proyeksi Pendapatan */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-1">
          <FaChartLine className="text-emerald-400" />
          <h4 className="text-white font-semibold">Proyeksi Pendapatan 4 Bulan</h4>
        </div>
        <p className="text-white/40 text-xs mb-5">
          Estimasi akumulasi pendapatan dari masa tanam hingga panen
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={incLineData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              tickFormatter={(v) =>
                v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt`
                : v >= 1000 ? `${(v / 1000).toFixed(0)}rb` : v
              }
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(val, name) => [
                formatCurrency(val),
                COMMODITY_LABELS[name] || name
              ]}
            />
            <Legend
              formatter={(val) => COMMODITY_LABELS[val] || val}
              wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            {models.map((m) => (
              <Line key={m.commodity} {...sharedLineProps(m.commodity)} />
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
          ${value === "" ? "bg-gray-800/80 border-gray-600 text-white/30" : "bg-gray-800/80 border-emerald-500 text-white"}`}
        style={{ colorScheme: "dark" }}
      >
        <option value="" disabled className="bg-gray-900 text-white/30">— Pilih {label} —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

const defaultInputs = {
  luas_lahan: "", stok_pupuk: "", pekerjaan_sampingan: "",
  kekurangan_pangan: "", target_pendapatan: "",
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const data = await response.json()

      setResult({
        recommendation: data.recommendation,
        commodities:    data.commodities,
        econReasons:    data.reason       || [],
        foodReasons:    data.food_reasons || [],
        conclusion:     data.conclusion,
        marketContext:  data.market_context,
        models:         data.models       || [],
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const row1 = [
    { name: "luas_lahan", label: "Luas Lahan", options: [
      { value: "sangat_kecil", label: "Sangat Kecil (<0,1 ha)" },
      { value: "kecil",        label: "Kecil (0,1 - 0,5 ha)" },
      { value: "sedang",       label: "Sedang (0,5 - 1 ha)" },
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
    { name: "kekurangan_pangan", label: "Kekurangan Pangan", options: [
      { value: "tidak_pernah", label: "Tidak Pernah" },
      { value: "jarang",       label: "Jarang" },
      { value: "kadang",       label: "Kadang-kadang" },
      { value: "sering",       label: "Sering" },
    ]},
    { name: "target_pendapatan", label: "Target Pendapatan", options: [
      { value: "rendah",   label: "Rendah (<1 juta)" },
      { value: "menengah", label: "Menengah (1 - 5 juta)" },
      { value: "tinggi",   label: "Tinggi (>5 juta)" },
    ]},
  ]

  const isTumpangsari = result?.models?.length > 1
  const totalIncome   = result?.models?.reduce((s, m) => s + (m.income?.value || 0), 0) || 0

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
                    <span key={c} className="px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1"
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

            {/* Charts Proyeksi */}
            <EstimasiChart models={result.models} />

            {/* Detail per Komoditas */}
            {result.models.map((m, idx) => (
              <div key={m.commodity} className={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ color: COMMODITY_COLORS[m.commodity] || "#888" }}>
                    {COMMODITY_ICONS[m.commodity]}
                  </span>
                  <h4 className="text-white font-semibold text-lg">
                    {COMMODITY_LABELS[m.commodity] || m.commodity}
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">Estimasi Produksi</p>
                    <p className="text-white font-semibold">
                      {m.production?.value?.toLocaleString("id-ID")} {m.production?.unit}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">Estimasi Pendapatan</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(m.income?.value || 0)}
                    </p>
                  </div>
                  {m.price_summary?.avg_price > 0 && (
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/40 text-xs mb-1">Rata-rata Harga</p>
                      <p className="text-white font-semibold">
                        Rp {m.price_summary.avg_price?.toLocaleString("id-ID")}/kg
                      </p>
                    </div>
                  )}
                  {m.price_summary?.trend && (
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/40 text-xs mb-1">Tren Harga</p>
                      <p className={`font-semibold capitalize ${
                        m.price_summary.trend === "naik"  ? "text-green-400" :
                        m.price_summary.trend === "turun" ? "text-red-400"   : "text-yellow-400"
                      }`}>
                        {m.price_summary.trend}
                        {m.price_summary.trend !== "stabil" && ` (${m.price_summary.pct_change}%)`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Badge meets_target */}
                {isTumpangsari ? (
                  idx === 0 && (
                    <div className={`text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2 mb-4 ${
                      m.meets_target ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      <span>{m.meets_target ? "✅" : "⚠️"}</span>
                      <span>
                        {m.meets_target
                          ? `Akumulasi pendapatan tumpangsari memenuhi target — Total: ${formatCurrency(totalIncome)}`
                          : `Akumulasi pendapatan tumpangsari belum memenuhi target — Total: ${formatCurrency(totalIncome)}`
                        }
                      </span>
                    </div>
                  )
                ) : (
                  <div className={`text-xs px-3 py-1.5 rounded-lg inline-block mb-4 ${
                    m.meets_target ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                  }`}>
                    {m.meets_target ? "✅ Memenuhi target pendapatan" : "⚠️ Belum memenuhi target pendapatan"}
                  </div>
                )}

                <div className="space-y-2">
                  {m.reasons?.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Analisis Ketahanan Pangan */}
            <div className={cardStyle}>
              <h4 className="text-white font-semibold mb-4">Analisis dan Rekomendasi Ketahanan Pangan</h4>
              <div className="space-y-3">
                {[...result.econReasons, ...result.foodReasons].map((r, i) => {
                  const isFood = i >= result.econReasons.length
                  return (
                    <div key={i} className="flex items-start gap-3 text-sm text-white/70 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      {isFood
                        ? <FaArrowRight className="text-amber-400 mt-0.5 shrink-0" />
                        : <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />}
                      <span>{r}</span>
                    </div>
                  )
                })}
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