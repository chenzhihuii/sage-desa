import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { FaEnvelope, FaUser, FaPencilAlt, FaPaperPlane, FaCopy, FaCheckCircle } from "react-icons/fa";
import QRCode from "react-qr-code";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const surveyLink = "https://forms.gle/zNheQxLeC1GEV1Uw7";

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyLink);
    alert("Link berhasil disalin!");
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_l2cpyzv", "template_xzcujqg", formRef.current, "eKHJlYRnffyAzc-j0")
      .then(() => {
        setShowPopup(true);
        formRef.current.reset();
        setTimeout(() => setShowPopup(false), 3000);
      })
      .catch(() => alert("Gagal mengirim pesan"));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen pt-16 bg-gradient-to-br from-[#EAF0DE] via-[#F0F5E8] to-[#EAF0DE] dark:from-black dark:via-gray-900 dark:to-black">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">
            Aspirasi & Kontak
          </h1>
          <p className="text-gray-700 dark:text-white/50 text-sm">Kami terbuka dengan kritik dan saran</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* LEFT - Survei */}
          <motion.div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#87a96b]/40 dark:border-white/10 text-center">
            <h2 className="text-xl font-bold mb-5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Survei Pengalaman Pengguna
            </h2>

            <div className="flex justify-center mb-3">
              <motion.div
                animate={{ boxShadow: ["0 0 10px rgba(168,85,247,0.4)", "0 0 25px rgba(236,72,153,0.6)", "0 0 10px rgba(168,85,247,0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white p-4 rounded-xl"
              >
                <QRCode value={surveyLink} size={200} />
              </motion.div>
            </div>

            <p className="text-gray-500 dark:text-white/60 text-sm mb-3">Scan QR untuk mengisi survei (±1 menit)</p>

            <div className="flex justify-center gap-3 flex-wrap">
              <button onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-purple-400 text-purple-500 dark:text-purple-400 hover:bg-purple-400 hover:text-white transition">
                <FaCopy /> Copy Link
              </button>
              <a href={surveyLink} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 text-sm rounded-full border border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-400 hover:text-white transition">
                Buka Survei
              </a>
            </div>

            <div className="mt-6 border-t border-[#87a96b]/40 dark:border-white/10 pt-4 text-left text-gray-500 dark:text-white/60 text-sm space-y-2">
              <p className="font-medium text-gray-700 dark:text-white/80">Isi survei meliputi:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kemudahan penggunaan aplikasi</li>
                <li>Kelengkapan fitur</li>
                <li>Kecepatan & performa</li>
                <li>Kepuasan keseluruhan</li>
                <li>Saran pengembangan</li>
              </ul>
            </div>
          </motion.div>

          {/* RIGHT - Form */}
          <motion.div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#87a96b]/40 dark:border-white/10 flex flex-col">
            <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Hubungi Kami
            </h2>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-5 flex flex-col h-full">
              {[
                { label: "Nama", name: "user_name", type: "text", placeholder: "Masukkan nama Anda", icon: <FaUser className="absolute left-3 top-3 text-purple-400" /> },
                { label: "Email", name: "user_email", type: "email", placeholder: "contoh: john@gmail.com", icon: <FaEnvelope className="absolute left-3 top-3 text-purple-400" /> },
                { label: "Subjek", name: "subject", type: "text", placeholder: "Contoh: Kritik fitur login", icon: <FaPencilAlt className="absolute left-3 top-3 text-purple-400" /> },
              ].map(({ label, name, type, placeholder, icon }) => (
                <div key={name}>
                  <label className="text-gray-700 dark:text-white/80 text-sm">{label}</label>
                  <div className="relative mt-1">
                    {icon}
                    <input type={type} name={name} placeholder={placeholder}
                      className="w-full pl-10 py-2 bg-white dark:bg-white/5 border border-[#87a96b]/45 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-purple-400" />
                  </div>
                </div>
              ))}

              <div className="flex flex-col flex-1">
                <label className="text-gray-700 dark:text-white/80 text-sm">Pesan</label>
                <textarea name="message" placeholder="Tuliskan pesan, kritik, atau saran Anda di sini..."
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-white/5 border border-[#87a96b]/45 dark:border-white/10 rounded-lg text-gray-900 dark:text-white resize-none flex-1 min-h-[120px] placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-purple-400" />
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                <FaPaperPlane /> Kirim Pesan
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-50 dark:bg-gray-900 border border-[#87a96b]/40 dark:border-white/10 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl">
              <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Berhasil!</h3>
              <p className="text-gray-500 dark:text-white/60 text-sm mb-4">Pesan Anda telah berhasil dikirim.</p>
              <button onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contact;
