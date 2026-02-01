// WeatherCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import WeatherIcon from "./WeatherIcon";
import { FaTemperatureHigh, FaWind, FaTint } from "react-icons/fa";

const LAT = -8.11;
const LON = 112.25;

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async () => {
    try {
      const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: LAT,
          lon: LON,
          appid: API_KEY,
          units: "metric",
          lang: "id",
        },
      });

      const forecastRes = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: {
          lat: LAT,
          lon: LON,
          appid: API_KEY,
          units: "metric",
          lang: "id",
        },
      });

      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError("Gagal mengambil data cuaca");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-green-400" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-500/10 p-6 rounded-xl text-white text-center">{error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            {/* lokasi dikecilin */}
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">Desa Sumberarum, Kab. Blitar</h2>

            {/* suhu utama dikecilin */}
            <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">{Math.round(weather.main.temp)}°C</p>

            <p className="text-sm text-white/70 mt-1 capitalize">{weather.weather[0].description}</p>
          </div>

          <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 6, repeat: Infinity }} className="w-24 h-24 flex items-center justify-center">
            <WeatherIcon weather={weather.weather[0]} size="text-6xl text-white" />
          </motion.div>
        </div>

        {/* METRICS (COMPACT & SEJAJAR ICON) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* FEELS LIKE */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <FaTemperatureHigh className="text-green-400 text-2xl flex-shrink-0" />
              <div className="leading-tight">
                <p className="text-sm text-white/60">Terasa Seperti</p>
                <p className="text-lg font-semibold text-white">{Math.round(weather.main.feels_like)}°C</p>
              </div>
            </div>
          </div>

          {/* HUMIDITY */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <FaTint className="text-blue-400 text-2xl flex-shrink-0" />
              <div className="leading-tight">
                <p className="text-sm text-white/60">Kelembapan</p>
                <p className="text-lg font-semibold text-white">{weather.main.humidity}%</p>
              </div>
            </div>
          </div>

          {/* WIND */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <FaWind className="text-purple-400 text-2xl flex-shrink-0" />
              <div className="leading-tight">
                <p className="text-sm text-white/60">Kecepatan Angin</p>
                <p className="text-lg font-semibold text-white">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORECAST */}
        <h3 className="text-lg font-semibold text-white mb-4">Perkiraan Cuaca</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forecast.list.slice(0, 6).map((item, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WeatherIcon weather={item.weather[0]} size="text-3xl text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">{Math.round(item.main.temp)}°C</p>
                    <p className="text-xs text-white/60">
                      {new Date(item.dt * 1000).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/60 capitalize">{item.weather[0].description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
