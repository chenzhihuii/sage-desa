import KPICard from "../components/KPI";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444"];

const tooltipStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  borderColor: "rgba(255, 255, 255, 0.1)",
  color: "#f3f4f6",
  borderRadius: "0.75rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
  padding: "12px",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const cardStyle = `
  bg-gradient-to-br from-green-400/5 via-blue-500/5 to-purple-500/5 
  backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl p-6
`;

export default function EksplorasiPage() {
  const navigate = useNavigate();

  const [selectedCluster, setSelectedCluster] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/analytics/dashboard");

        if (!res.ok) {
          throw new Error("API error");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Data tidak tersedia. Pastikan backend aktif.</p>
      </div>
    );
  }

  const petaniData = data.petaniData ?? {};
  const umurChart = data.umurChart ?? [];
  const kemandirianChart = data.kemandirianChart ?? [];
  const lahanChart = data.lahanChart ?? [];
  const pendapatanChart = data.pendapatanChart ?? [];
  const petaniCluster = data.petaniCluster ?? [];

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 space-y-8 text-white">
      {/* BACK BUTTON */}
      <motion.div variants={itemVariants}>
        <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-green-500/50 transition">
          ← Kembali
        </button>
      </motion.div>

      {/* KPI */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard title="🧑‍🌾 Total Petani" value={petaniData.total ?? 0} unit="Orang" />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard title="🏔️ Rata-rata Lahan" value={petaniData.avgLahan ?? 0} unit="Ha" />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard title="🌽 Rata-rata Produksi" value={petaniData.avgProduksi ?? 0} unit="Kw/Ha" />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
          <KPICard title="🌾 Tahan Pangan" value={petaniData.tahanPanganPct ?? 0} unit="%" />
        </motion.div>
      </motion.div>

      {/* PIE CHART */}
      <motion.div variants={itemVariants} className={cardStyle}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={umurChart} dataKey="value" nameKey="name" outerRadius={100}>
              {umurChart.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* TABLE */}
      <motion.div variants={itemVariants} className={`${cardStyle} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th>Cluster</th>
              <th>Jumlah</th>
              <th>Lahan</th>
              <th>Pendapatan</th>
              <th>Ketahanan</th>
            </tr>
          </thead>
          <tbody>
            {petaniCluster.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td>{c.cluster}</td>
                <td>{c.jumlah}</td>
                <td>{c.avgLahan}</td>
                <td>{c.avgPendapatan}</td>
                <td>{c.ketahanan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
