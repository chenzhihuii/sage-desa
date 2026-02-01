import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = "http://127.0.0.1:8000/api";

const Rekomendasi = () => {
  const [formData, setFormData] = useState({
    luas_lahan: "",
    stok_pupuk: "",
    pekerjaan_sampingan: "",
    kekurangan_pangan: "",
    target_pendapatan: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //------------------------------------

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Tidak bisa terhubung ke server 😢");
    }

    setLoading(false);
  };

  //------------------------------------

  const chartData =
    result?.models?.[0]?.price_forecast?.forecast?.map((f) => ({
      day: f.day,
      price: f.price,
    })) || [];

  //------------------------------------

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">AI Crop Recommendation</h1>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <SelectField
              label="Luas Lahan"
              name="luas_lahan"
              options={[
                { label: "Sangat kecil (<0.5 ha)", value: "sangat_kecil" },
                { label: "Kecil (0.5-1 ha)", value: "kecil" },
                { label: "Sedang (1-2 ha)", value: "sedang" },
                { label: "Besar (>3 ha)", value: "besar" },
              ]}
              value={formData.luas_lahan}
              onChange={handleChange}
            />

            <SelectField
              label="Stok Pupuk"
              name="stok_pupuk"
              options={[
                { label: "Tidak ada", value: "tidak_ada" },
                { label: "Sedikit", value: "sedikit" },
                { label: "Cukup", value: "cukup" },
                { label: "Banyak", value: "banyak" },
              ]}
              value={formData.stok_pupuk}
              onChange={handleChange}
            />

            <SelectField
              label="Pekerjaan Sampingan"
              name="pekerjaan_sampingan"
              options={[
                { label: "Ada", value: "ada" },
                { label: "Tidak ada", value: "tidak_ada" },
              ]}
              value={formData.pekerjaan_sampingan}
              onChange={handleChange}
            />

            <SelectField
              label="Kekurangan Pangan"
              name="kekurangan_pangan"
              options={[
                { label: "Tidak pernah", value: "tidak_pernah" },
                { label: "Jarang", value: "jarang" },
                { label: "Kadang", value: "kadang" },
                { label: "Sering", value: "sering" },
              ]}
              value={formData.kekurangan_pangan}
              onChange={handleChange}
            />

            <SelectField
              label="Target Pendapatan"
              name="target_pendapatan"
              options={[
                { label: "≤ 1 juta", value: "rendah" },
                { label: "1–5 juta", value: "menengah" },
                { label: "5–10 juta", value: "tinggi" },
              ]}
              value={formData.target_pendapatan}
              onChange={handleChange}
            />
          </div>

          <button disabled={loading} className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold disabled:opacity-50">
            {loading ? "AI sedang menganalisis..." : "Generate Recommendation"}
          </button>
        </form>

        {/* ERROR */}

        {error && <p className="text-red-400 text-center mt-6 font-semibold">{error}</p>}

        {/* RESULT */}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">🌾 {result.recommendation}</h2>

            <ul className="text-white/70 space-y-2 mb-8">
              {result.reason?.map((r, i) => (
                <li key={i}>✔ {r}</li>
              ))}
            </ul>

            {chartData.length > 0 && (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="day" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

//------------------------------------

const SelectField = ({ label, name, options, value, onChange }) => (
  <div>
    <label className="text-white/70 text-sm">{label}</label>

    <select required name={name} value={value} onChange={onChange} className="w-full mt-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400">
      <option value="">Pilih...</option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default Rekomendasi;
