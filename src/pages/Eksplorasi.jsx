"use client"

import KPICard from "../components/KPI"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from "recharts"

const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444"]

const tooltipStyle = {
  backgroundColor: 'rgba(17, 24, 39, 0.95)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  color: '#f3f4f6',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  padding: '12px'
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const cardStyle = `
  bg-gradient-to-br from-green-400/5 via-blue-500/5 to-purple-500/5 
  backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl p-6
  hover:shadow-green-500/10 hover:border-white/20 transition-all duration-300
`

export default function EksplorasiPage() {
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/analytics/dashboard")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Gagal mengambil data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse font-medium">Mengambil data SAGE-Desa...</p>
        </div>
      </div>
    )
  }

  if (!data) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Data tidak ditemukan. Pastikan backend menyala.</p>
    </div>
  )

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 space-y-8 text-white"
    >
      
      {/* ========================== HEADER DENGAN LOGO ========================== */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-6">
          
          {/* Logo Container */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg shadow-green-500/20 overflow-hidden p-0">
            <img 
              // 👇 Panggil path langsung dari root public (tanpa import)
              src="/assets/logo sage desa.png" 
              alt="Logo SAGE Desa" 
              className="w-full h-full object-contain drop-shadow-md" 
            />
          </div>

          {/* Teks Judul */}
          <div className="space-y-1">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">
              Eksplorasi Data Ketahanan Pangan
            </h2>
            <p className="text-white/60 text-lg">
              Analisis karakteristik petani, demografi, dan faktor ketahanan pangan (Live Data)
            </p>
          </div>

        </div>
      </motion.div>
      {/* ======================================================================== */}

      {/* KPI Cards Area */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className={cardStyle}>
           <KPICard title="Total Petani" value={data.petaniData.total} unit="Orang" trend="+12%" trendPositive />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
           <KPICard title="Rata-rata Lahan" value={data.petaniData.avgLahan} unit="Ha" trend="-5%" trendPositive={false} />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
           <KPICard title="Rata-rata Produksi" value={data.petaniData.avgProduksi} unit="Kw/Ha" trend="+8%" trendPositive />
        </motion.div>
        <motion.div variants={itemVariants} className={cardStyle}>
           <KPICard 
             title="Status Tahan Pangan" 
             value={data.petaniData.tahanPanganPct} 
             unit="%" 
             trend="Stabil" 
             trendPositive 
            />
        </motion.div>
      </motion.div>

      {/* Charts Area 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-xl font-semibold mb-6 text-green-400">Distribusi Umur Petani</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.umurChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {data.umurChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#ffffff' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-xl font-semibold mb-6 text-blue-400">Status Kemandirian Pangan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.kemandirianChart} layout="vertical" margin={{ left: 20, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <YAxis dataKey="status" type="category" width={130} stroke="rgba(255,255,255,0.8)" tick={{fill: 'rgba(255,255,255,0.8)', fontSize: 13}} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={tooltipStyle} itemStyle={{ color: '#ffffff' }} formatter={(value) => [`${value} Petani`, 'Jumlah']}/>
              <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} barSize={40} label={{ position: 'right', fill: '#ffffff', fontSize: 12, fontWeight: 'bold', formatter: (value) => `${value} Petani` }}>
                {data.kemandirianChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'Tahan pangan' ? '#4ade80' : entry.status === 'Kekurangan sementara' ? '#fbbf24' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Area 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-xl font-semibold mb-6 text-purple-400">Distribusi Pendapatan (Prediksi AI)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.pendapatanChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11}} interval={0} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#ffffff' }} />
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="count" stroke="#a855f7" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className={cardStyle}>
          <h3 className="text-xl font-semibold mb-6 text-orange-400">Sebaran Ukuran Lahan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.lahanChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={tooltipStyle} itemStyle={{ color: '#ffffff' }} />
              <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Table Section */}
      <motion.div variants={itemVariants} className={`${cardStyle} overflow-hidden p-0`}>
        <div className="p-6 pb-2">
           <h3 className="text-xl font-semibold text-white">Clustering Petani (CLARA Analysis)</h3>
           <p className="text-white/40 text-sm mt-1">Pengelompokan otomatis berdasarkan Indeks Ketahanan & Pendapatan.</p>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-green-400">Cluster</th>
                <th className="px-6 py-4 text-sm font-semibold text-white/60">Jumlah Petani</th>
                <th className="px-6 py-4 text-sm font-semibold text-white/60">Rata-rata Lahan</th>
                <th className="px-6 py-4 text-sm font-semibold text-white/60">Rata-rata Pendapatan</th>
                <th className="px-6 py-4 text-sm font-semibold text-white/60">Level Ketahanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.petaniCluster.map((cluster) => (
                <tr
                  key={cluster.id}
                  className={`cursor-pointer transition-colors duration-200 
                    ${selectedCluster === cluster.id ? "bg-green-500/10" : "hover:bg-white/5"}
                  `}
                  onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">{cluster.cluster}</td>
                  <td className="px-6 py-4 text-sm text-white/60">{cluster.jumlah} petani</td>
                  <td className="px-6 py-4 text-sm text-white/60">{cluster.avgLahan} ha</td>
                  <td className="px-6 py-4 text-sm text-white/60">Rp {cluster.avgPendapatan} juta</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        cluster.ketahanan === "Sangat Tinggi" ? "bg-green-600/10 text-green-500 border-green-600/20" : 
                        cluster.ketahanan === "Tinggi" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                        cluster.ketahanan === "Sedang" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : 
                        cluster.ketahanan === "Rendah" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
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
  )
}