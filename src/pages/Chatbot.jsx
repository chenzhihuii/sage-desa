import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

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
    setChat((prev) => [...prev, userMessage]);

    const currentInput = input.trim();
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const limitedResponse = limitWords(data.reply, 100);

      const aiMessage = {
        role: "ai",
        content: limitedResponse,
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Terjadi kesalahan saat menghubungi server. Silakan coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Viewport height fix
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
      <Navbar />

      <div className="container mx-auto px-4 h-[calc(100%-5rem)] pt-20 flex flex-col">
        <h1 className="text-center text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">AI Asisten Agrikultur</h1>

        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chat.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "bg-gradient-to-r from-green-400 to-blue-500 text-white" : "bg-white/10 text-white/90"}`}>{msg.content}</div>
              </motion.div>
            ))}

            {loading && <div className="text-white/60">Sedang mengetik...</div>}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                className="flex-grow bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading} className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
