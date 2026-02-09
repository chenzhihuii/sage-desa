import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { FaSeedling } from "react-icons/fa";

const CropsData = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const crops = [
    {
      name: "Jagung",
      image: "/assets/corn.jpeg",
      description: "Tanaman pangan utama selain padi.",
      waterRequirement: "500–800 mm",
      fullDescription: "Jagung merupakan tanaman pangan penting yang banyak dibudidayakan di Indonesia. Cocok ditanam di dataran rendah hingga menengah dengan pengairan yang cukup.",
    },
    {
      name: "Cabai Rawit",
      image: "/assets/cabe.jpg",
      description: "Tanaman hortikultura bernilai ekonomi tinggi.",
      waterRequirement: "600–1200 mm",
      fullDescription: "Cabai rawit membutuhkan perawatan intensif, terutama dalam pengairan dan pengendalian hama. Sensitif terhadap genangan air.",
    },
    {
      name: "Kedelai",
      image: "/assets/kedelai.jpg",
      description: "Sumber protein nabati utama.",
      waterRequirement: "450–700 mm",
      fullDescription: "Kedelai merupakan tanaman palawija yang tumbuh optimal pada tanah gembur dengan drainase baik.",
    },
    {
      name: "Ketela Rambat",
      image: "/assets/ubi.jpg",
      description: "Tanaman umbi yang mudah dibudidayakan.",
      waterRequirement: "750–1500 mm",
      fullDescription: "Ketela rambat atau ubi jalar cocok ditanam di lahan tegalan dan pekarangan, serta relatif tahan kekeringan.",
    },
    {
      name: "Ketela Pohon",
      image: "/assets/singkong.jpg",
      description: "Tanaman umbi tahan kekeringan.",
      waterRequirement: "1000–1500 mm",
      fullDescription: "Ketela pohon atau singkong banyak dibudidayakan di lahan kering dan menjadi sumber pangan alternatif.",
    },
    {
      name: "Kacang Tanah",
      image: "/assets/kacang.jpg",
      description: "Tanaman legum sumber protein.",
      waterRequirement: "500–700 mm",
      fullDescription: "Kacang tanah tumbuh baik pada tanah gembur dan berpasir, serta membutuhkan sinar matahari penuh.",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Data Tanaman</h1>
          <p className="text-lg text-white/60">Informasi komoditas pertanian Desa Sumberarum</p>
        </motion.div>

        {/* GRID KOMODITAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                setSelectedCrop(crop);
                setIsPopupVisible(true);
              }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-white/20 transition"
            >
              <div className="h-44 mb-4 rounded-lg overflow-hidden">
                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
              </div>

              <h2 className="text-xl font-semibold text-white mb-2">{crop.name}</h2>

              <p className="text-sm text-white/60 mb-3">{crop.description}</p>

              <div className="flex items-center text-green-400 text-sm">
                <FaSeedling className="mr-2" />
                Kebutuhan air: {crop.waterRequirement}
              </div>
            </motion.div>
          ))}
        </div>

        {/* POPUP DETAIL */}
        {isPopupVisible && selectedCrop && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setIsPopupVisible(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gray-900 p-6 rounded-2xl max-w-xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <img src={selectedCrop.image} alt={selectedCrop.name} className="w-full h-56 object-cover rounded-lg mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">{selectedCrop.name}</h2>
              <p className="text-white/70 mb-4">{selectedCrop.fullDescription}</p>
              <div className="text-green-400 mb-4">
                <FaSeedling className="inline mr-2" />
                Kebutuhan air: {selectedCrop.waterRequirement}
              </div>
              <button onClick={() => setIsPopupVisible(false)} className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white">
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CropsData;
