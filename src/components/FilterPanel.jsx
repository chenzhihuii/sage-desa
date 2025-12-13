"use client"

import { useState } from "react"
import { Filter, ChevronDown, ChevronUp } from "lucide-react" // Menambahkan icon chevron
import { motion, AnimatePresence } from "framer-motion"

export default function FilterPanel() {
  const [expanded, setExpanded] = useState(false)

  // Style input yang bisa dipakai ulang
  const selectStyle = `
    w-full px-4 py-2 rounded-xl 
    bg-black/40 border border-white/10 text-white 
    focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50
    transition-all duration-300 appearance-none cursor-pointer
  `

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-400/5 via-blue-500/5 to-purple-500/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-blue-500/20 text-green-400 group-hover:text-green-300 transition-colors">
            <Filter className="w-5 h-5" />
          </div>
          <span className="font-semibold text-white tracking-wide">Filter Data</span>
        </div>
        
        {/* Indikator Panah */}
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-white/50" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/50" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Select Desa */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">Pilih Desa</label>
                  <div className="relative">
                    <select className={selectStyle}>
                      <option className="bg-gray-900 text-white">Desa Sumberarum</option>
                      <option className="bg-gray-900 text-white">Desa Kemuning</option>
                      <option className="bg-gray-900 text-white">Desa Wanasari</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                {/* Select Tahun */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">Tahun</label>
                  <div className="relative">
                    <select className={selectStyle}>
                      <option className="bg-gray-900 text-white">2025</option>
                      <option className="bg-gray-900 text-white">2024</option>
                      <option className="bg-gray-900 text-white">2023</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                {/* Select Tipe Analisis */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">Tipe Analisis</label>
                  <div className="relative">
                    <select className={selectStyle}>
                      <option className="bg-gray-900 text-white">Semua Kategori</option>
                      <option className="bg-gray-900 text-white">Produktivitas Lahan</option>
                      <option className="bg-gray-900 text-white">Ketahanan Pangan</option>
                      <option className="bg-gray-900 text-white">Analisis Ekonomi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button className="px-5 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-medium">
                  Reset
                </button>
                <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-200 text-sm">
                  Terapkan Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}