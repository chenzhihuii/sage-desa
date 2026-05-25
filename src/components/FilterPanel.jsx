"use client"

import { useState } from "react"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FilterPanel() {
  const [expanded, setExpanded] = useState(false)

  const selectStyle = `
    w-full px-4 py-2 rounded-xl
    bg-white dark:bg-black/40
    border border-green-200 dark:border-white/10
    text-gray-800 dark:text-white
    focus:outline-none focus:border-green-400/70 dark:focus:border-green-400/50
    focus:ring-1 focus:ring-green-400/50
    transition-all duration-300 appearance-none cursor-pointer
  `

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5
        border border-[#91C6BC]/30 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#91C6BC]/10 dark:hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-blue-500/20 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
            <Filter className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-800 dark:text-white tracking-wide">Filter Data</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 dark:text-white/50" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-white/50" />
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
            <div className="border-t border-[#91C6BC]/20 dark:border-white/10 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Select Desa */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/70">Pilih Desa</label>
                  <div className="relative">
                    <select className={selectStyle}>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Desa Sumberarum</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Desa Kemuning</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Desa Wanasari</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-white/40 pointer-events-none" />
                  </div>
                </div>

                {/* Select Tahun */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/70">Tahun</label>
                  <div className="relative">
                    <select className={selectStyle}>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">2025</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">2024</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">2023</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-white/40 pointer-events-none" />
                  </div>
                </div>

                {/* Select Tipe Analisis */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/70">Tipe Analisis</label>
                  <div className="relative">
                    <select className={selectStyle}>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Semua Kategori</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Produktivitas Lahan</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Ketahanan Pangan</option>
                      <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Analisis Ekonomi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button className="px-5 py-2 rounded-xl border border-[#91C6BC]/30 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-[#91C6BC]/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm font-medium">
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
