import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { FaPhone, FaWhatsapp, FaUser } from "react-icons/fa";

const Connect = () => {
  const contact = {
    name: "Pak Rizky",
    role: "Penyuluh Pertanian",
    description: "Konsultasi seputar pertanian, cuaca, pola tanam, dan permasalahan pertanian di Desa Sumberarum.",
    imageUrl: "/assets/Pak Rizky.png",
    phone: "+62812345",
    whatsapp: "62812345",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 bg-gradient-to-br from-[#c5e3de] via-[#e0f0ed] to-[#c5e3de] dark:from-black dark:via-gray-900 dark:to-black">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight max-w-3xl mx-auto bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Hubungi Penyuluh</h1>
          <p className="text-xl text-gray-500 dark:text-white/60">Konsultasi pertanian Desa Sumberarum, Kabupaten Blitar</p>
        </motion.div>

        {/* CARD */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-md w-full backdrop-blur-xl bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#91C6BC]/30 dark:border-white/10 pt-20 pb-8">
            <div className="p-6 flex flex-col items-center">
              {/* FOTO */}
              <div className="w-32 h-32 -mt-14 mb-4 relative">
                <div className="absolute inset-0 rounded-full shadow-lg"></div>
                <img src={contact.imageUrl} alt={contact.name} className="w-full h-full rounded-full object-cover border-4 border-[#91C6BC]/30 dark:border-white/10 shadow-xl" />
              </div>

              {/* INFO */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FaUser className="text-green-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{contact.name}</h2>
                </div>

                <p className="text-gray-500 dark:text-white/70 text-sm mb-2">{contact.role}</p>

                <p className="text-gray-500 dark:text-white/60 text-sm mb-6">{contact.description}</p>

                {/* BUTTON */}
                <div className="flex gap-3">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`tel:${contact.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg transition-all"
                  >
                    <FaPhone />
                    <span>Telepon</span>
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg transition-all"
                  >
                    <FaWhatsapp />
                    <span>WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Connect;
