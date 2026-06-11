"use client";

import KPICard from "../components/KPI";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Users, Map, TrendingUp, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, Label } from "recharts";

// Warna Chart
const COLORS = ["#22c55e", "#f97316", "#ef4444", "#707ff1ff"];

// Style tooltip custom
const tooltipStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  borderColor: "rgba(255, 255, 255, 0.1)",
  color: "#f3f4f6",
  borderRadius: "0.75rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
  padding: "10px",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// ✅ Spacing dikecilkan: p-4 (dari p-6), gap dikecilkan juga
const cardStyle = `
  bg-white dark:bg-white/5
  backdrop-blur-xl border border-[#87a96b]/40 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-4
  hover:shadow-[0_4px_16px_rgba(135,169,107,0.25)] dark:hover:shadow-green-500/10 hover:border-[#87a96b]/55 dark:hover:border-white/20 transition-all duration-300
`;

const KEMANDIRIAN_COLOR = {
  "Tahan pangan": "#4ade80",
  "Kekurangan sementara": "#fbbf24",
  Rentan: "#f87171",
};

const STATUS_DISPLAY = {
  "Kekurangan sementara": "Cukup Tahan",
};
const displayStatus = (s) => STATUS_DISPLAY[s] || s;

const FIELD_LABELS = {
  komoditas: "Komoditas",
  luas_lahan: "Luas Lahan (ha)",
  status_lahan: "Status Lahan",
  pendidikan: "Pendidikan",
  status_petani: "Status Petani",
  produksi: "Produksi (kw/ha)",
  subsidi: "Subsidi",
  pelatihan: "Pelatihan",
  cadangan_pangan: "Cadangan Pangan",
};

function KemandirianChart({ kemandirianChart }) {
  const [hoveredEntry, setHoveredEntry] = useState(null);
  const [petaniMap, setPetaniMap] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(null);
  const { isDark } = useTheme();
  const cGrid = isDark ? "rgba(255,255,255,0.1)" : "rgba(135,169,107,0.25)";
  const cAxis = isDark ? "rgba(255,255,255,0.5)" : "#4b5563";
  const cTick = isDark ? "rgba(255,255,255,0.5)" : "#374151";
  const cTickB = isDark ? "rgba(255,255,255,0.8)" : "#1f2937";
  const cCur = isDark ? "rgba(255,255,255,0.05)" : "rgba(135,169,107,0.15)";
  const cLabel = isDark ? "#ffffff" : "#374151";

  const fetchPetani = async (status) => {
    if (petaniMap[status]) return;
    setLoadingStatus(status);
    try {
      const res = await fetch(`http://127.0.0.1:8000/analytics/kemandirian-petani?status=${encodeURIComponent(status)}`);
      const data = await res.json();
      setPetaniMap((prev) => ({ ...prev, [status]: data.petani || [] }));
    } catch (e) {
      setPetaniMap((prev) => ({ ...prev, [status]: [] }));
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleBarEnter = (entry) => {
    setHoveredEntry(entry);
    fetchPetani(entry.status);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0" style={{ width: hoveredEntry ? "45%" : "100%", transition: "width 0.2s" }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={kemandirianChart} layout="vertical" margin={{ left: 20, right: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={cGrid} horizontal={false} />
            <XAxis type="number" stroke={cAxis} tick={{ fill: cTick }} />
            <YAxis dataKey="status" type="category" width={130} stroke={cTickB} tick={{ fill: cTickB, fontSize: 13 }} tickFormatter={displayStatus} />
            <Tooltip
              cursor={{ fill: cCur }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const entry = payload[0].payload;
                const color = KEMANDIRIAN_COLOR[entry.status] || "#ffffff";
                return (
                  <div style={tooltipStyle}>
                    <p style={{ color, fontWeight: 700, fontSize: 13 }}>{displayStatus(entry.status)}</p>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{entry.jumlah} Petani — hover untuk detail</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="jumlah"
              radius={[0, 4, 4, 0]}
              barSize={36}
              label={{ position: "right", fill: cLabel, fontSize: 12, fontWeight: "bold", formatter: (v) => `${v} Petani` }}
              onMouseEnter={(entry) => handleBarEnter(entry)}
              onMouseLeave={() => setHoveredEntry(null)}
            >
              {kemandirianChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={KEMANDIRIAN_COLOR[entry.status] || "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {hoveredEntry && (
        <div
          className="flex-1 overflow-hidden rounded-xl"
          style={{
            background: isDark ? "rgba(17,24,39,0.97)" : "#F6F3EB",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(135,169,107,0.4)",
            minWidth: 0
          }}
          onMouseEnter={() => setHoveredEntry(hoveredEntry)}
          onMouseLeave={() => setHoveredEntry(null)}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(135,169,107,0.25)" }}
          >
            <span style={{ color: KEMANDIRIAN_COLOR[hoveredEntry.status] || "#aaa", fontWeight: 700, fontSize: 13 }}>{displayStatus(hoveredEntry.status)}</span>
            <span className="text-gray-400 dark:text-white/40 text-xs">{hoveredEntry.jumlah} Petani</span>
          </div>
          <div className="overflow-auto" style={{ maxHeight: 240 }}>
            {loadingStatus === hoveredEntry.status ? (
              <div className="flex items-center justify-center py-8 text-gray-400 dark:text-white/40 text-xs">Memuat data...</div>
            ) : (
              <table className="w-full text-left border-collapse" style={{ fontSize: 11 }}>
                <thead>
                  <tr className="sticky top-0" style={{ background: isDark ? "rgba(17,24,39,0.98)" : "#EDE9DE" }}>
                    {Object.keys(FIELD_LABELS).map((k) => (
                      <th key={k} className="px-3 py-2 text-gray-500 dark:text-white/50 font-semibold whitespace-nowrap" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(135,169,107,0.25)" }}>
                        {FIELD_LABELS[k]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(petaniMap[hoveredEntry.status] || []).map((p, i) => (
                    <tr key={i} className="transition-colors" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(135,169,107,0.15)" }}>
                      {Object.keys(FIELD_LABELS).map((k) => (
                        <td key={k} className="px-3 py-1.5 text-gray-700 dark:text-white/80 whitespace-nowrap">
                          {k === "luas_lahan" || k === "produksi" ? Number(p[k]).toLocaleString("id-ID") : (p[k] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EksplorasiPage() {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const cGrid = isDark ? "rgba(255,255,255,0.1)" : "rgba(135,169,107,0.25)";
  const cAxis = isDark ? "rgba(255,255,255,0.5)" : "#4b5563";
  const cTick = isDark ? "rgba(255,255,255,0.5)" : "#374151";
  const cCur = isDark ? "rgba(255,255,255,0.05)" : "rgba(135,169,107,0.15)";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/analytics/dashboard");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF0DE] dark:bg-black flex items-center justify-center text-gray-900 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse font-medium">Mengambil data SAGE-Desa...</p>
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="min-h-screen bg-[#EAF0DE] dark:bg-black flex items-center justify-center text-gray-900 dark:text-white">
        <p>Data tidak ditemukan. Pastikan backend menyala.</p>
      </div>
    );

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#EAF0DE] via-[#F0F5E8] to-[#EAF0DE] dark:from-black dark:via-gray-900 dark:to-black pt-24 px-6 pb-6 space-y-5 text-gray-900 dark:text-white"
    >
      <Navbar />

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-4 text-center">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold pb-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">Eksplorasi Data Ketahanan Pangan</h2>
          <p className="text-gray-500 dark:text-white/60 text-lg">Analisis karakteristik petani, demografi, dan faktor ketahanan pangan (Live Data)</p>
        </div>
      </motion.div>

      {/* KPI Cards Area */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard icon={<Users size={18} className="text-green-400" />} title="Total Petani" value={data.petaniData.total} unit="Orang" trend="+12%" trendPositive />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard icon={<Map size={18} className="text-blue-400" />} title="Rata-rata Lahan" value={data.petaniData.avgLahan} unit="Ha" trend="-5%" trendPositive={false} />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard icon={<TrendingUp size={18} className="text-purple-400" />} title="Rata-rata Produksi" value={data.petaniData.avgProduksi} unit="Kw/Ha" trend="+8%" trendPositive />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard icon={<ShieldCheck size={18} className="text-orange-400" />} title="Status Tahan Pangan" value={data.petaniData.tahanPanganPct} unit="%" trend="Stabil" trendPositive />
        </motion.div>
      </motion.div>

      {/* Charts Area 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-base font-semibold mb-4 text-green-400">Distribusi Umur Petani</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.umurChart} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} (${value})`} outerRadius={95} fill="#8884d8" dataKey="value" stroke="none">
                {data.umurChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#ffffff" }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: "16px" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className={`${cardStyle} relative`}>
          <h3 className="text-base font-semibold mb-4 text-blue-400">Status Kemandirian Pangan</h3>
          <KemandirianChart kemandirianChart={data.kemandirianChart} />
        </motion.div>
      </div>

      {/* Charts Area 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-base font-semibold mb-4 text-purple-400">Distribusi Pendapatan Petani</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.pendapatanChart} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={cGrid} vertical={false} />
              <XAxis dataKey="range" stroke={cAxis} tick={{ fill: cTick, fontSize: 11 }} interval={0}>
                <Label value="Rentang Pendapatan" offset={-10} position="insideBottom" fill={cAxis} fontSize={12} />
              </XAxis>
              <YAxis stroke={cAxis} tick={{ fill: cTick }}>
                <Label value="Jumlah Petani" angle={-90} position="insideLeft" fill={cAxis} fontSize={12} dy={50} />
              </YAxis>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#ffffff" }} />
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="count" stroke="#a855f7" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-base font-semibold mb-4 text-orange-400">Sebaran Ukuran Lahan</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.lahanChart} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={cGrid} vertical={false} />
              <XAxis dataKey="name" stroke={cAxis} tick={{ fill: cTick }}>
                <Label value="Ukuran Lahan (Ha)" offset={-10} position="insideBottom" fill={cAxis} fontSize={12} />
              </XAxis>
              <YAxis stroke={cAxis} tick={{ fill: cTick }}>
                <Label value="Jumlah Petani" angle={-90} position="insideLeft" fill={cAxis} fontSize={12} dy={50} />
              </YAxis>
              <Tooltip cursor={{ fill: cCur }} contentStyle={tooltipStyle} itemStyle={{ color: "#ffffff" }} />
              <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Table Section */}
      <motion.div variants={itemVariants} className={`${cardStyle} overflow-hidden !p-0`}>
        <div className="p-4 pb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Klasterisasi Petani</h3>
          <p className="text-gray-400 dark:text-white/40 text-sm mt-0.5">KMeans++ Anaysis | Pengelompokan Otomatis Berdasarkan Kondisi Petani</p>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[#87a96b]/40 dark:border-white/10 bg-[#F0EDE5] dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-green-500 dark:text-green-400">Cluster</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/60">Jumlah Petani</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/60">Karakteristik</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/60">Level Ketahanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {data.petaniCluster.map((cluster) => (
                <tr
                  key={cluster.id}
                  className={`cursor-pointer transition-colors duration-200
                    ${selectedCluster === cluster.id ? "bg-green-500/10" : "hover:bg-[#87a96b]/12 dark:hover:bg-white/5"}
                  `}
                  onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{cluster.cluster}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-white/60">{cluster.jumlah} petani</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-white/60">{cluster.implikasi}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        cluster.ketahanan === "Tinggi"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : cluster.ketahanan === "Sedang"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : cluster.ketahanan === "Rendah"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {cluster.ketahanan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
