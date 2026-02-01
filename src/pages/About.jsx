import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { FaLeaf, FaSeedling, FaHandHoldingHeart } from "react-icons/fa";

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[380px] mb-12">
        <div className="absolute inset-0">
          <img src="/assets/jagung-closeup.jpg" alt="Lanskap pertanian" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Pertanian Cerdas Desa</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              SAGE-Desa hadir untuk mendukung transformasi sektor pertanian melalui pemanfaatan teknologi dan kecerdasan buatan, guna membantu petani mengambil keputusan yang lebih tepat, berkelanjutan, dan produktif.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-semibold text-white mb-4">Misi Kami</h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Kami percaya bahwa teknologi memiliki peran penting dalam meningkatkan ketahanan dan kesejahteraan pertanian desa. SAGE-Desa bertujuan menyediakan informasi, analisis, dan rekomendasi berbasis data yang dapat membantu petani
              menerapkan praktik pertanian yang lebih efisien dan berkelanjutan.
            </p>
            <div className="flex items-center gap-2 text-green-400">
              <FaLeaf />
              <span>Pertanian Berkelanjutan</span>
            </div>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-2xl overflow-hidden">
            <img src="/assets/environmental-conservation-plant-sustainability.jpg" alt="Teknologi pertanian" className="w-full h-[260px] object-cover" />
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white/5 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4">
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-semibold text-white text-center mb-8">
            Komitmen Kami
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FaSeedling,
                title: "Inovasi",
                description: "Mengembangkan dan menerapkan teknologi pertanian yang relevan dengan kebutuhan desa dan petani.",
              },
              {
                icon: FaHandHoldingHeart,
                title: "Pemberdayaan",
                description: "Mendukung petani dengan informasi dan data untuk mendukung pengambilan keputusan.",
              },
              {
                icon: FaLeaf,
                title: "Keberlanjutan",
                description: "Mendorong praktik pertanian yang ramah lingkungan demi masa depan yang lebih baik.",
              },
            ].map((value, index) => (
              <motion.div key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 + index * 0.1 }} className="text-center">
                <value.icon className="text-4xl text-green-400 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-white/60">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
