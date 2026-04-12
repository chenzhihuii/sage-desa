import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaChartLine, FaPepperHot, FaExclamationTriangle, FaCheckCircle, FaSync, FaChevronDown } from "react-icons/fa";
import { GiCorn } from "react-icons/gi";
import { Bean } from "lucide-react";
import Navbar from "../components/Navbar";
import { FaMagnifyingGlass } from "react-icons/fa6";

const COMMODITY_COLORS = {
  jagung: "#f59e0b",
  cabai: "#ef4444",
  kedelai: "#22c55e",
};
const COMMODITY_LABELS = {
  jagung: "Jagung",
  cabai: "Cabai",
  kedelai: "Kedelai",
};
const COMMODITY_ICONS = {
  jagung: <GiCorn className="inline mr-1" />,
  cabai: <FaPepperHot className="inline mr-1" />,
  kedelai: <Bean size={14} className="inline mr-1" />,
};
const tooltipStyle = {
  backgroundColor: "rgba(10, 15, 30, 0.97)",
  borderColor: "rgba(255,255,255,0.08)",
  color: "#f3f4f6",
  borderRadius: "0.75rem",
  padding: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};
const cardStyle = "bg-white/5 border border-white/10 shadow-lg rounded-2xl p-6";

const formatCurrency = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

const formatDurasi = (bulanFloat) => {
  if (!bulanFloat || bulanFloat <= 0) return "kurang dari 1 minggu";
  const bulan = Math.floor(bulanFloat);
  const minggu = Math.round((bulanFloat - bulan) * 4);
  if (bulan === 0) return `sekitar ${Math.max(1, minggu)} minggu`;
  if (minggu === 0) return `sekitar ${bulan} bulan`;
  if (minggu >= 3) return `sekitar ${bulan + 1} bulan`;
  return `sekitar ${bulan} bulan ${minggu} minggu`;
};

// ─── Reason Groups ────────────────────────────────────────────────────────────
const REASON_GROUPS = [
  { tag: "pendapatan", label: "Pendapatan & Ketahanan Pangan", checkColor: "#1D9E75", badgeBg: "rgba(29,158,117,0.15)", badgeColor: "#1D9E75" },
  { tag: "strategi_jual", label: "Strategi Jual", checkColor: "#BA7517", badgeBg: "rgba(186,117,23,0.15)", badgeColor: "#BA7517" },
  { tag: "pengolahan", label: "Pengolahan Hasil Panen", checkColor: "#378ADD", badgeBg: "rgba(55,138,221,0.15)", badgeColor: "#378ADD" },
  { tag: "tumpangsari", label: "Tips Tumpangsari", checkColor: "#7F77DD", badgeBg: "rgba(127,119,221,0.15)", badgeColor: "#7F77DD" },
  { tag: "risiko", label: "Risiko & Mitigasi", checkColor: "#E24B4A", badgeBg: "rgba(226,75,74,0.15)", badgeColor: "#E24B4A" },
];

function GroupedReasons({ reasons }) {
  const normalized = reasons.map((r) => (typeof r === "string" ? { tag: "pendapatan", text: r } : r));
  return (
    <div className={cardStyle}>
      <h4 className="text-white font-semibold mb-5">Analisis & Saran</h4>
      <div className="space-y-4">
        {REASON_GROUPS.map((group) => {
          const items = normalized.filter((r) => r.tag === group.tag);
          if (items.length === 0) return null;
          return (
            <div key={group.tag} className="rounded-xl border border-white/8 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/8" style={{ backgroundColor: group.badgeBg }}>
                <span className="text-xs font-semibold tracking-wide" style={{ color: group.badgeColor }}>
                  {group.label}
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm text-white/70 leading-relaxed">
                    <FaCheckCircle className="mt-0.5 shrink-0" style={{ color: group.checkColor }} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Banner Kecukupan (Opsi C) ────────────────────────────────────────────────
function SufficiencyBanner({ totalIncome, targetIncome, targetSiklus, durasi, selfConsumption, tanggunganLabel }) {
  const scTotal = selfConsumption?.total || 0;
  const bulanBertahan = targetIncome > 0 ? totalIncome / targetIncome : 0;
  const cukupSiklus = totalIncome >= targetSiklus;
  const pct = targetSiklus > 0 ? Math.min(Math.round((totalIncome / targetSiklus) * 100), 100) : 0;
  const durasi_str = formatDurasi(bulanBertahan);

  const borderColor = cukupSiklus ? "#1D9E75" : pct >= 70 ? "#BA7517" : "#E24B4A";
  const textColor = cukupSiklus ? "#22c55e" : pct >= 70 ? "#f59e0b" : "#ef4444";
  const barColor = borderColor;

  const gap = targetSiklus - totalIncome;
  const surplus = totalIncome - targetSiklus;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden" style={{ borderLeft: `3px solid ${borderColor}`, borderRadius: "0 1rem 1rem 0" }}>
      <div className="p-5 flex items-center gap-6 flex-wrap">
        {/* Kiri: label + durasi */}
        <div className="min-w-[140px]">
          <p className="text-white/40 text-xs mb-1">Ketahanan pangan</p>
          <p className="text-2xl font-bold leading-tight" style={{ color: textColor }}>
            {cukupSiklus ? "Mencukupi" : durasi_str}
          </p>
          <p className="text-white/40 text-xs mt-1">{cukupSiklus ? `satu siklus tanam penuh (${durasi} bln)` : `dari ${durasi} bulan siklus tanam`}</p>
        </div>

        {/* Tengah: progress bar + keterangan */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-xs text-white/30 mb-1.5">
            <span>Pendapatan panen</span>
            <span>{formatCurrency(totalIncome)}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
          </div>
          <div className="flex justify-between text-xs text-white/30 mt-1.5">
            <span>
              Target {durasi} bln ({tanggunganLabel})
            </span>
            <span>{formatCurrency(targetSiklus)}</span>
          </div>
          {scTotal > 0 && <p className="text-xs text-emerald-400/60 mt-1.5">+ hemat konsumsi sendiri ~{formatCurrency(scTotal)}/bulan</p>}
        </div>

        {/* Kanan: status kekurangan/surplus */}
        <div className="text-right min-w-[130px]">
          {cukupSiklus ? (
            <>
              <p className="text-xs text-white/30 mb-1">Surplus per bulan</p>
              <p className="text-base font-semibold" style={{ color: "#22c55e" }}>
                +{formatCurrency(Math.round(surplus / durasi))}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-white/30 mb-1">Kekurangan per bulan</p>
              <p className="text-base font-semibold" style={{ color: "#ef4444" }}>
                ~{formatCurrency(Math.round(gap / durasi))}
              </p>
              <p className="text-xs text-white/20 mt-0.5">dari {formatCurrency(targetIncome)}/bln</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dropdown Komoditas ───────────────────────────────────────────────────────
function CommodityDropdown({ models, selected, onSelect }) {
  if (models.length <= 1) return null;
  return (
    <div className="relative shrink-0">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-white/10 border border-white/20 text-white text-sm
          rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/30"
        style={{ colorScheme: "dark" }}
      >
        {models.map((m) => (
          <option key={m.commodity} value={m.commodity} className="bg-gray-900">
            {COMMODITY_LABELS[m.commodity]}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-xs pointer-events-none" />
    </div>
  );
}

// ─── Grafik Prediksi Harga ────────────────────────────────────────────────────
function PriceForecastChart({ models }) {
  const isTumpangsari = models.length > 1;
  const [selected, setSelected] = useState(models[0]?.commodity || "");
  if (!models || models.length === 0) return null;

  const activeModel = models.find((m) => m.commodity === selected) || models[0];
  const isCabai = activeModel.commodity === "cabai";
  const color = COMMODITY_COLORS[activeModel.commodity] || "#888";
  const forecast = activeModel.price_forecast || {};

  const chartData = isCabai
    ? (forecast.daily_forecast || []).map((p) => ({ label: p.label, value: p.projected_price, pct_change: p.price_change_pct }))
    : (forecast.monthly_forecast || []).map((p) => ({ label: p.label, value: p.projected_price, pct_change: p.price_change_pct }));

  if (chartData.length === 0) return null;

  const trend = forecast.trend || "stabil";
  const riskLevel = forecast.risk_level || "rendah";
  const basePrice = forecast.base_price || 0;
  const dataSource = forecast.data_source || "-";

  const trendColor = trend === "naik" ? "#22c55e" : trend === "turun" ? "#ef4444" : "#94a3b8";
  const trendIcon = trend === "naik" ? "📈" : trend === "turun" ? "📉" : "➡️";
  const riskColor = riskLevel === "tinggi" ? "#ef4444" : riskLevel === "sedang" ? "#f59e0b" : "#22c55e";

  const firstLabel = chartData[0]?.label || "";
  const lastLabel = chartData[chartData.length - 1]?.label || "";
  const chartTitle = isCabai ? `Prediksi Harga Cabai saat Panen (${firstLabel} – ${lastLabel})` : `Prediksi Harga ${COMMODITY_LABELS[activeModel.commodity]} saat Panen (${firstLabel} – ${lastLabel})`;

  // Y-axis domain dengan padding agar fluktuasi terlihat
  const values = chartData.map((d) => d.value).filter(Boolean);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  const pad = (maxVal - minVal) * 0.3 || maxVal * 0.02;
  const yDomain = [Math.floor(minVal - pad), Math.ceil(maxVal + pad)];

  const CustomDot = (props) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
      <g key={`pdot-${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={4} fill={color} stroke={color + "80"} strokeWidth={1} />
      </g>
    );
  };

  const CustomLabel = (props) => {
    const { x, y, value } = props;
    if (value == null) return null;
    const fmt = value.toLocaleString("id-ID"); // → 82.846
    return (
      <text x={x} y={y - 10} textAnchor="middle" fill={color} fontSize={10} fontWeight={600}>
        {fmt}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const currentIndex = chartData.findIndex((d) => d.label === label);
    const prevValue = currentIndex > 0 ? chartData[currentIndex - 1].value : null;
    const currentValue = payload[0].value;
    const diff = prevValue != null ? currentValue - prevValue : null;
    const pctFromPrev = prevValue && diff != null ? ((diff / prevValue) * 100).toFixed(1) : null;

    return (
      <div style={tooltipStyle} className="min-w-[150px]">
        <p className="text-white/50 text-xs mb-2 pb-2 border-b border-white/10">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span style={{ color }} className="font-semibold text-sm">
            {COMMODITY_LABELS[activeModel.commodity]}
          </span>
        </div>
        <p className="text-white text-sm pl-4">
          Rp {currentValue.toLocaleString("id-ID")}/kg
          {pctFromPrev != null && pctFromPrev !== "0.0" && (
            <span className={`ml-2 text-xs ${diff > 0 ? "text-green-400" : "text-red-400"}`}>
              {diff > 0 ? "▲" : "▼"} {Math.abs(pctFromPrev)}%
            </span>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className={cardStyle}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaChartLine style={{ color }} />
            <h4 className="text-white font-semibold">{chartTitle}</h4>
          </div>
          <p className="text-white/40 text-xs">{isCabai ? "Proyeksi harga harian cabai di periode panen berdasarkan volatilitas historis" : "Proyeksi harga bulanan di periode panen berdasarkan tren data historis"}</p>
        </div>
        {isTumpangsari && <CommodityDropdown models={models} selected={selected} onSelect={setSelected} />}
      </div>

      {/* HAPUS div badge tren/risiko/datasource, ganti cuma harga dasar */}
      <div className="flex items-center mt-3 mb-5">
        <span className="text-white/30 text-xs ml-auto">Harga dasar: Rp {basePrice.toLocaleString("id-ID")}/kg</span>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 24, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickLine={false} />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={yDomain}
            tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}rb` : v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={CustomDot} activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }} label={<CustomLabel />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="flex-1 min-w-[160px]">
      <label className="block text-xs text-white/60 mb-1.5 font-medium tracking-wide uppercase">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium
          focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 cursor-pointer
          ${value === "" ? "bg-gray-800/80 border-gray-600 text-white/30" : "bg-gray-800/80 border-emerald-500 text-white"}`}
        style={{ colorScheme: "dark" }}
      >
        <option value="" disabled className="bg-gray-900 text-white/30">
          — Pilih {label} —
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const defaultInputs = {
  luas_lahan: "",
  stok_pupuk: "",
  pekerjaan_sampingan: "",
  kekurangan_pangan: "",
  jumlah_tanggungan: "",
};

export default function RekomendasiPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const allFilled = Object.values(inputs).every((v) => v !== "");

  const handleSubmit = async () => {
    if (!allFilled) {
      setError("Mohon lengkapi semua pilihan.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult({
        recommendation: data.recommendation,
        commodities: data.commodities || [],
        reasons: Array.isArray(data.reasons) ? data.reasons : [],
        conclusion: data.conclusion || "",
        marketContext: data.market_context || {},
        models: Array.isArray(data.models) ? data.models : [],
        targetIncome: data.target_income || 0,
        targetSiklus: data.target_siklus || 0,
        durasi: data.durasi_tanam || 4,
        tanggunganLabel: data.tanggungan_label || "",
        selfConsumption: data.self_consumption || { total: 0, per_commodity: {} },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const row1 = [
    {
      name: "luas_lahan",
      label: "Luas Lahan",
      options: [
        { value: "sangat_kecil", label: "Sangat Kecil (<0.1 ha)" },
        { value: "kecil", label: "Kecil (0.1 - 0.5 ha)" },
        { value: "sedang", label: "Sedang (0.5 - 1 ha)" },
        { value: "besar", label: "Besar (>1 ha)" },
      ],
    },
    {
      name: "stok_pupuk",
      label: "Stok Pupuk",
      options: [
        { value: "tidak_ada", label: "Tidak Ada" },
        { value: "sedikit", label: "Sedikit" },
        { value: "cukup", label: "Cukup" },
        { value: "banyak", label: "Banyak" },
      ],
    },
    {
      name: "pekerjaan_sampingan",
      label: "Pekerjaan Sampingan",
      options: [
        { value: "ada", label: "Ada" },
        { value: "tidak_ada", label: "Tidak Ada" },
      ],
    },
  ];

  const row2 = [
    {
      name: "kekurangan_pangan",
      label: "Frekuensi Kekurangan Pangan",
      options: [
        { value: "tidak_pernah", label: "Tidak Pernah" },
        { value: "jarang", label: "Jarang" },
        { value: "kadang", label: "Kadang-kadang" },
        { value: "sering", label: "Sering" },
      ],
    },
    {
      name: "jumlah_tanggungan",
      label: "Jumlah Tanggungan Keluarga",
      options: [
        { value: "satu_dua", label: "1–2 orang" },
        { value: "tiga_empat", label: "3–4 orang" },
        { value: "lima_lebih", label: "5 orang atau lebih" },
      ],
    },
  ];

  const isTumpangsari = result?.models?.length > 1;
  const totalIncome = result?.models?.reduce((s, m) => s + (m.income?.value || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 px-4 md:px-8 pb-12 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold pb-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">Rekomendasi Ketahanan Pangan</h1>
          <p className="text-white/50 text-sm md:text-base">Sistem Rekomendasi berbasis Deep Reinforcement Learning</p>
        </div>

        {/* Input Card */}
        <div className={cardStyle}>
          <div className="flex flex-wrap gap-3 mb-3">
            {row1.map((f) => (
              <SelectField key={f.name} label={f.label} name={f.name} value={inputs[f.name]} onChange={handleChange} options={f.options} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            {row2.map((f) => (
              <SelectField key={f.name} label={f.label} name={f.name} value={inputs[f.name]} onChange={handleChange} options={f.options} />
            ))}
            <div className="flex flex-col justify-end flex-1 min-w-[160px]">
              <button
                onClick={handleSubmit}
                disabled={loading || !allFilled}
                className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide text-white
                  transition-all duration-200 shadow-lg flex items-center justify-center gap-2
                  ${allFilled && !loading ? "bg-emerald-600 hover:bg-emerald-500 cursor-pointer" : "bg-gray-700 cursor-not-allowed opacity-50"}`}
              >
                {loading ? (
                  <>
                    <FaSync className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <FaMagnifyingGlass />
                    Dapatkan Rekomendasi
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}
          {!allFilled && !error && <p className="text-white/30 text-xs mt-3 text-right">Lengkapi semua pilihan untuk mengaktifkan tombol rekomendasi</p>}
        </div>

        {result && (
          <div className="space-y-6">
            {/* Header Rekomendasi */}
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-white/50 text-sm mb-1">Rekomendasi Tanaman</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-teal-400">{result.recommendation}</h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {result.commodities.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1"
                      style={{ borderColor: (COMMODITY_COLORS[c] || "#888") + "60", color: COMMODITY_COLORS[c] || "#888", backgroundColor: (COMMODITY_COLORS[c] || "#888") + "15" }}
                    >
                      {COMMODITY_ICONS[c]}
                      {COMMODITY_LABELS[c] || c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2 Card Estimasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={cardStyle}>
                <p className="text-white/50 text-sm mb-4">Estimasi Produksi</p>
                {!isTumpangsari ? (
                  <div>
                    <p className="text-5xl font-bold" style={{ color: COMMODITY_COLORS[result.models[0].commodity] }}>
                      {result.models[0].production?.value ?? "-"}
                    </p>
                    <p className="text-white/40 text-sm mt-2">kwintal/ha</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.models.map((m) => (
                      <div key={m.commodity} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium" style={{ color: COMMODITY_COLORS[m.commodity] }}>
                          {COMMODITY_ICONS[m.commodity]}
                          {COMMODITY_LABELS[m.commodity]}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-white text-xl">{m.production?.value ?? "-"}</span>
                          <span className="text-white/40 text-xs ml-1">kwintal/ha</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={cardStyle}>
                <p className="text-white/50 text-sm mb-4">Estimasi Pendapatan</p>
                {!isTumpangsari ? (
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">{formatCurrency(result.models[0].income?.value || 0)}</p>
                    <p className="text-white/40 text-sm mt-2">per panen</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-4xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
                    <div className="flex gap-4 flex-wrap pt-1">
                      {result.models.map((m) => (
                        <span key={m.commodity} className="text-xs">
                          <span style={{ color: COMMODITY_COLORS[m.commodity] }} className="flex items-center gap-1">
                            {COMMODITY_ICONS[m.commodity]}
                            {COMMODITY_LABELS[m.commodity]}
                          </span>
                          <span className="text-white/50 mt-0.5 block">{formatCurrency(m.income?.value || 0)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grafik Prediksi Harga */}
            <PriceForecastChart models={result.models} />

            {/* Banner Kecukupan — Opsi C, setelah grafik */}
            <SufficiencyBanner totalIncome={totalIncome} targetIncome={result.targetIncome} targetSiklus={result.targetSiklus} durasi={result.durasi} selfConsumption={result.selfConsumption} tanggunganLabel={result.tanggunganLabel} />

            {/* Analisis & Saran */}
            {result.reasons.length > 0 && <GroupedReasons reasons={result.reasons} />}

            {/* Catatan */}
            <div className="bg-white/3 border border-white/8 rounded-xl px-5 py-3 flex items-center gap-3">
              <FaExclamationTriangle className="text-amber-400 shrink-0" />
              <p className="text-white/40 text-xs">Rekomendasi ini bersifat pendukung keputusan dan perlu disesuaikan dengan kondisi lapangan aktual.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
