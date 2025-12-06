import React, { useState, useEffect } from "react";
// --- BARIS INI DIGANTI ---
import { GoogleGenAI } from "@google/genai";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import Navbar from "../components/Navbar";

// --- INISIALISASI GEMINI SDK DENGAN ENV VARIABLE BARU ---
// Pastikan nama variable di .env.local kamu adalah VITE_GEMINI_API_KEY
const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash"; // Model tercepat & batas gratis besar

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const limitWords = (text, maxWords) => {
    const words = text.split(" ");
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };

    // 1. Tambahkan pesan user ke state chat
    setChat((prevChat) => [...prevChat, userMessage]);

    const currentInput = input.trim();
    setInput("");
    setLoading(true);

    try {
      // --- PERINTAH API GEMINI ---
      const responseStream = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: [{ role: "user", parts: [{ text: currentInput }] }],
      });

      let responseText = "";
      for await (const chunk of responseStream) {
        // Gabungkan chunk-chunk teks yang datang dari Gemini
        responseText += chunk.text;
      }
      // ----------------------------

      const limitedResponse = limitWords(responseText, 100);
      const aiMessage = { role: "ai", content: limitedResponse || "Maaf, terjadi kesalahan atau tidak ditemukan jawaban." };

      // 2. Tambahkan pesan AI ke state chat setelah respons lengkap
      setChat((prevChat) => [...prevChat, aiMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Tampilkan pesan error yang ramah pengguna
      const errorMessage = { role: "ai", content: "Terjadi kesalahan koneksi API. Mungkin batas harian (Free Tier) sudah tercapai atau token salah." };
      setChat((prevChat) => [...prevChat, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Logika untuk set viewport height (vh) - Tetap Sama
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
      <Navbar />

      <div className="container mx-auto px-4 h-[calc(100%-5rem)] pt-20 flex flex-col">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">AI Agriculture Assistant</h1>
          <p className="text-sm text-white/60">Ask me anything about farming and agriculture</p>
        </motion.div>

        <motion.div
          className="flex-1 bg-gradient-to-br from-green-400/10 via-blue-500/10 to-purple-500/10 
                       backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg 
                       flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chat.map((message, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${message.role === "user" ? "bg-gradient-to-r from-green-400 to-blue-500 text-white" : "bg-white/10 text-white/90"}`}>{message.content}</div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl bg-white/10 text-white/60">
                  <div className="flex space-x-1">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.1 }} className="w-2 h-2 bg-white rounded-full"></motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.3 }} className="w-2 h-2 bg-white rounded-full"></motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.5 }} className="w-2 h-2 bg-white rounded-full"></motion.span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/20 border-t border-white/10">
            <div className="flex gap-2">
              <input
                className="flex-grow bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3
                            focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl
                            flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/20 flex-shrink-0"
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? "..." : <FaPaperPlane />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
