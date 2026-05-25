import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import WeatherIcon from "./WeatherIcon";
import { FaTemperatureHigh, FaWind, FaTint } from "react-icons/fa";

const LAT = -8.2483;
const LON = 112.3386;
const API_KEY = "99fdd4cb00e534bbbba703cfd9cfa34d";

function translateWeather(desc) {
  if (!desc) return "";
  const text = desc.toLowerCase().trim();
  if (text.includes("langit cerah")) return "Cerah";
  if (text.includes("awan pecah")) return "Berawan Tebal";
  if (text.includes("awan tersebar")) return "Berawan";
  if (text.includes("awan mendung")) return "Mendung";
  if (text.includes("hujan rintik")) return "Gerimis";
  if (text.includes("hujan ringan")) return "Hujan Ringan";
  if (text.includes("hujan sedang")) return "Hujan";
  if (text.includes("hujan lebat")) return "Hujan Lebat";
  if (text.includes("badai")) return "Badai Petir";
  if (text.includes("kabut")) return "Berkabut";
  return desc;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat: LAT, lon: LON, appid: API_KEY, units: "metric", lang: "id" },
      });
      const forecastRes = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: { lat: LAT, lon: LON, appid: API_KEY, units: "metric", lang: "id" },
      });
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data cuaca");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-green-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 p-6 rounded-xl text-red-600 dark:text-white text-center">{error}</div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4">
      <div className="bg-white dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-[#87a96b]/40 dark:border-white/10 shadow-sm dark:shadow-none">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-1">
              Desa Sumberarum, Kab. Blitar
            </h2>
            <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {Math.round(weather.main.temp)}°C
            </p>
          </div>
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="w-24 h-24 flex items-center justify-center"
            >
              <WeatherIcon weather={weather.weather[0]} size="text-8xl text-green-500 dark:text-white" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-white/80 capitalize">
              {translateWeather(weather.weather[0].description)}
            </h3>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FaTemperatureHigh className="text-green-500 text-2xl" />, label: "Terasa Seperti", value: `${Math.round(weather.main.feels_like)}°C` },
            { icon: <FaTint className="text-blue-400 text-2xl" />, label: "Kelembapan", value: `${weather.main.humidity}%` },
            { icon: <FaWind className="text-purple-400 text-2xl" />, label: "Kecepatan Angin", value: `${weather.wind.speed} m/s` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-[#F6F3EB] dark:bg-white/5 p-4 rounded-xl border border-[#87a96b]/35 dark:border-white/10">
              <div className="flex items-center gap-3">
                {icon}
                <div>
                  <p className="text-sm text-gray-700 dark:text-white/60">{label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FORECAST */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Perkiraan Cuaca</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forecast.list.slice(0, 6).map((item, i) => (
            <div key={i} className="bg-[#F6F3EB] dark:bg-white/5 p-4 rounded-xl border border-[#87a96b]/35 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WeatherIcon weather={item.weather[0]} size="text-3xl text-green-500 dark:text-white" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(item.main.temp)}°C</p>
                    <p className="text-xs text-gray-700 dark:text-white/60">
                      {new Date(item.dt * 1000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/60 capitalize">
                  {translateWeather(item.weather[0].description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
