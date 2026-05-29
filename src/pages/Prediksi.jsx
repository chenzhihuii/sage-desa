import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, ComposedChart, ReferenceLine, ReferenceArea, Brush } from "recharts";
import useWeatherForecast from "../hooks/useWeatherForecast";
import useCommodityForecast from "../hooks/useCommodityForecast";
import WeatherIcon from "../components/WeatherIcon";
import { WiThermometer, WiHumidity } from "react-icons/wi";
import { FaSeedling, FaPepperHot, FaBottleWater, FaEgg, FaBowlRice } from "react-icons/fa6";
import { GiCorn } from "react-icons/gi";
import { Bean } from "lucide-react";
import { MdLocationOn, MdAccessTime, MdCalendarMonth, MdAccountBalance, MdWarning, MdOutlineWaterDrop, MdInfo, MdClose, MdHistory } from "react-icons/md";
import { IoCloudOutline } from "react-icons/io5";
import { BsDropletFill } from "react-icons/bs";

const COLORS = {
  temperature: "#ef4444",
  humidity: "#3b82f6",
  jagung: "#f59e0b",
  cabai: "#ef4444",
  kedelai: "#22c55e",
  berasPremium: "#ceb0fa",
  berasMedium: "#a78bfa",
  berasSphp: "#60a5fa",
  minyakita: "#eab308",
  telur: "#f97316",
};

const tooltipStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  borderColor: "rgba(255, 255, 255, 0.1)",
  color: "#f3f4f6",
  borderRadius: "0.75rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
  padding: "12px",
};

const HIDDEN_KEYS = new Set(["bandBase", "bandSize"]);

const PriceTooltip = ({ active, payload, label, unit = "Rp/kg" }) => {
  if (!active || !payload?.length) return null;
  const visible = payload.filter((p) => !HIDDEN_KEYS.has(p.dataKey) && p.value != null);
  if (!visible.length) return null;
  return (
    <div style={tooltipStyle}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 6 }}>Tanggal: {label}</p>
      {visible.map((entry, i) => (
        <p key={i} style={{ color: entry.color || "#fff", fontSize: 13, margin: "2px 0" }}>
          {entry.name}:{" "}
          <span style={{ fontWeight: 600 }}>
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(entry.value)}
          </span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}> /{unit === "Rp/L" ? "L" : "kg"}</span>
        </p>
      ))}
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const cardStyle = `
  bg-white dark:bg-white/5
  backdrop-blur-xl border border-[#87a96b]/40 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6
  hover:shadow-[0_4px_16px_rgba(135,169,107,0.25)] dark:hover:shadow-green-500/10 hover:border-[#87a96b]/55 dark:hover:border-white/20 transition-all duration-300
`;

const weatherForecastData = [
  { month: "Nov", suhuLower: 26, suhuUpper: 30, suhuPredicted: 28, kelembabanLower: 70, kelembabanUpper: 82, kelembabanPredicted: 76 },
  { month: "Des", suhuLower: 25, suhuUpper: 29, suhuPredicted: 27, kelembabanLower: 75, kelembabanUpper: 88, kelembabanPredicted: 82 },
  { month: "Jan", suhuLower: 25, suhuUpper: 28, suhuPredicted: 26.5, kelembabanLower: 78, kelembabanUpper: 90, kelembabanPredicted: 85 },
  { month: "Feb", suhuLower: 25, suhuUpper: 29, suhuPredicted: 27, kelembabanLower: 76, kelembabanUpper: 88, kelembabanPredicted: 83 },
  { month: "Mar", suhuLower: 26, suhuUpper: 30, suhuPredicted: 28, kelembabanLower: 72, kelembabanUpper: 85, kelembabanPredicted: 79 },
  { month: "Apr", suhuLower: 27, suhuUpper: 31, suhuPredicted: 29, kelembabanLower: 68, kelembabanUpper: 80, kelembabanPredicted: 74 },
];

const commodityForecastData = [
  { month: "Nov", jagungLower: 5200, jagungUpper: 5800, jagungPredicted: 5500, cabaiLower: 42000, cabaiUpper: 58000, cabaiPredicted: 50000, kedelaiLower: 11500, kedelaiUpper: 13000, kedelaiPredicted: 12200 },
  { month: "Des", jagungLower: 5400, jagungUpper: 6000, jagungPredicted: 5700, cabaiLower: 48000, cabaiUpper: 62000, cabaiPredicted: 55000, kedelaiLower: 11800, kedelaiUpper: 13200, kedelaiPredicted: 12500 },
  { month: "Jan", jagungLower: 5600, jagungUpper: 6200, jagungPredicted: 5900, cabaiLower: 55000, cabaiUpper: 72000, cabaiPredicted: 63000, kedelaiLower: 12000, kedelaiUpper: 13500, kedelaiPredicted: 12700 },
  { month: "Feb", jagungLower: 5500, jagungUpper: 6100, jagungPredicted: 5800, cabaiLower: 52000, cabaiUpper: 68000, cabaiPredicted: 60000, kedelaiLower: 12200, kedelaiUpper: 13800, kedelaiPredicted: 13000 },
  { month: "Mar", jagungLower: 5300, jagungUpper: 5900, jagungPredicted: 5600, cabaiLower: 45000, cabaiUpper: 58000, cabaiPredicted: 52000, kedelaiLower: 12000, kedelaiUpper: 13400, kedelaiPredicted: 12700 },
  { month: "Apr", jagungLower: 5200, jagungUpper: 5700, jagungPredicted: 5450, cabaiLower: 40000, cabaiUpper: 52000, cabaiPredicted: 46000, kedelaiLower: 11800, kedelaiUpper: 13200, kedelaiPredicted: 12500 },
];

const otherCommodityData = [
  {
    month: "Nov",
    berasPremiumLower: 14000,
    berasPremiumUpper: 15200,
    berasPremiumPredicted: 14600,
    berasMediumLower: 12500,
    berasMediumUpper: 13500,
    berasMediumPredicted: 13000,
    berasSphpLower: 12000,
    berasSphpUpper: 13000,
    berasSphpPredicted: 12500,
    minyakitaLower: 14000,
    minyakitaUpper: 14500,
    minyakitaPredicted: 14200,
    telurLower: 28000,
    telurUpper: 31000,
    telurPredicted: 29500,
  },
  {
    month: "Des",
    berasPremiumLower: 14200,
    berasPremiumUpper: 15400,
    berasPremiumPredicted: 14800,
    berasMediumLower: 12600,
    berasMediumUpper: 13700,
    berasMediumPredicted: 13150,
    minyakPremiumLower: 18200,
    minyakPremiumUpper: 19700,
    minyakPremiumPredicted: 18950,
    minyakitaLower: 14000,
    minyakitaUpper: 14500,
    minyakitaPredicted: 14200,
    telurLower: 29000,
    telurUpper: 32000,
    telurPredicted: 30500,
  },
  {
    month: "Jan",
    berasPremiumLower: 14400,
    berasPremiumUpper: 15600,
    berasPremiumPredicted: 15000,
    berasMediumLower: 12800,
    berasMediumUpper: 13900,
    berasMediumPredicted: 13350,
    minyakPremiumLower: 18400,
    minyakPremiumUpper: 19900,
    minyakPremiumPredicted: 19150,
    minyakitaLower: 14000,
    minyakitaUpper: 14500,
    minyakitaPredicted: 14200,
    telurLower: 29500,
    telurUpper: 32500,
    telurPredicted: 31000,
  },
  {
    month: "Feb",
    berasPremiumLower: 14300,
    berasPremiumUpper: 15500,
    berasPremiumPredicted: 14900,
    berasMediumLower: 12700,
    berasMediumUpper: 13800,
    berasMediumPredicted: 13250,
    minyakPremiumLower: 18300,
    minyakPremiumUpper: 19800,
    minyakPremiumPredicted: 19050,
    minyakitaLower: 14000,
    minyakitaUpper: 14500,
    minyakitaPredicted: 14200,
    telurLower: 29000,
    telurUpper: 32000,
    telurPredicted: 30500,
  },
  {
    month: "Mar",
    berasPremiumLower: 14100,
    berasPremiumUpper: 15300,
    berasPremiumPredicted: 14700,
    berasMediumLower: 12600,
    berasMediumUpper: 13600,
    berasMediumPredicted: 13100,
    minyakPremiumLower: 18100,
    minyakPremiumUpper: 19600,
    minyakPremiumPredicted: 18850,
    minyakitaLower: 14000,
    minyakitaUpper: 14500,
    minyakitaPredicted: 14200,
    telurLower: 28500,
    telurUpper: 31500,
    telurPredicted: 30000,
  },
  {
    month: "Apr",
    berasPremiumLower: 14000,
    berasPremiumUpper: 15100,
    berasPremiumPredicted: 14550,
    berasMediumLower: 12500,
    berasMediumUpper: 13500,
    berasMediumPredicted: 13000,
    minyakPremiumLower: 18000,
    minyakPremiumUpper: 19500,
    minyakPremiumPredicted: 18750,
    minyakitaLower: 14000,
    minyakitaUpper: 14500,
    minyakitaPredicted: 14200,
    telurLower: 28000,
    telurUpper: 31000,
    telurPredicted: 29500,
  },
];

const modelMetrics = {
  weather: {
    suhu: { model: "ARIMAX", rmse: 1.62, mae: 0.96, mape: 3.44 },
    kelembaban: { model: "LSTM", rmse: 88.7, mae: 7.17, mape: 8.69 },
  },
  commodities: {
    jagung:        { model: "Bidirectional LSTM",    rmse: 94.77,   mae: 63.86,   mape: 1.03 },
    cabai:         { model: "Bidirectional LSTM",    rmse: 1459.13, mae: 930.18,  mape: 1.63 },
    kedelai:       { model: "Bidirectional LSTM",    rmse: 29.44,   mae: 20.24,   mape: 0.16 },
    berasPremium:  { model: "Bidirectional LSTM",    rmse: 17.99,   mae: 16.16,   mape: 0.11 },
    berasMedium:   { model: "Bidirectional LSTM",    rmse: 0.82,    mae: 0.71,    mape: 0.005},
    berasSphp:     { model: "Bidirectional LSTM",    rmse: 2.57,    mae: 2.09,    mape: 0.018},
    minyakita:     { model: "Exponential Smoothing", rmse: 47.40,   mae: 11.24,   mape: 0.07 },
    telur:         { model: "Bidirectional LSTM",    rmse: 218.60,  mae: 117.53,  mape: 0.43 },
  },
};

const predictionSummary = {
  suhu: { current: 28, trend: "+1.5°C", trendUp: true, description: "Suhu meningkat moderat hingga April" },
  kelembaban: { current: 78, trend: "-5%", trendUp: false, description: "Kelembaban menurun menuju musim kemarau" },
  jagung: { current: 5500, trend: "+3.2%", trendUp: true, description: "Harga stabil dengan kenaikan moderat" },
  cabai: { current: 50000, trend: "+26%", trendUp: true, description: "Kenaikan signifikan diprediksi Jan-Feb", warning: true },
  kedelai: { current: 12200, trend: "+4.1%", trendUp: true, description: "Tren naik stabil hingga Februari" },
};

// Harga fallback statis (dipakai hanya jika API gagal)
const currentPrices = {
  jagung: 5500,
  cabai: 50000,
  kedelai: 12200,
  berasPremium: 14600,
  berasMedium: 13000,
  berasSphp: 11600,
  minyakita: 14200,
  telur: 29500,
};

const currentWeather = {
  suhu: 28,
  kelembaban: 78,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CommodityLabel = ({ name }) => {
  const map = {
    suhu: (
      <>
        <WiThermometer className="inline mr-1" /> Suhu
      </>
    ),
    kelembaban: (
      <>
        <WiHumidity className="inline mr-1" /> Kelembaban
      </>
    ),
    jagung: (
      <>
        <GiCorn className="inline mr-1" /> Jagung
      </>
    ),
    cabai: (
      <>
        <FaPepperHot className="inline mr-1" /> Cabai Rawit
      </>
    ),
    kedelai: (
      <>
        <Bean size={14} className="inline mr-1" /> Kedelai
      </>
    ),
    berasPremium: (
      <>
        <FaBowlRice className="inline mr-1" /> Beras Premium
      </>
    ),
    berasMedium: (
      <>
        <FaBowlRice className="inline mr-1" /> Beras Medium
      </>
    ),
    berasSphp: (
      <>
        <FaBowlRice className="inline mr-1" /> Beras SPHP Bulog
      </>
    ),
    minyakita: (
      <>
        <FaBottleWater className="inline mr-1" /> Minyak MINYAKITA
      </>
    ),
    telur: (
      <>
        <FaEgg className="inline mr-1" /> Telur Ayam Ras
      </>
    ),
  };
  return map[name] || name;
};

// ── MapeBadge component (UPDATED) ────────────────────────────────────────────
const MapeBadge = ({ mae, mape, unit = "Rp/kg" }) => {
  const [showMAE, setShowMAE] = useState(false);
  const [showMAPE, setShowMAPE] = useState(false);

  const isGood = mape < 10;

  return (
    <div className="flex flex-col gap-0.5 mb-1">
      {/* MAE */}
      {mae !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-blue-400 dark:text-blue-300">
            MAE: {mae}
            <span className="text-xs font-normal text-gray-400 dark:text-white/40"> {unit}</span>
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMAE(!showMAE);
                setShowMAPE(false); // tutup yg lain
              }}
              className="text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
            >
              <MdInfo size={14} />
            </button>

            {showMAE && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMAE(false)} />
                <div className="absolute left-0 bottom-6 z-50 w-64 bg-gray-900 border border-white/10 rounded-xl p-3 shadow-xl text-xs text-white/80 leading-relaxed">Rata-rata kesalahan prediksi harga dalam satuan Rp/kg.</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MAPE */}
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-medium ${isGood ? "text-green-400" : "text-amber-400"}`}>MAPE: {mape}%</span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMAPE(!showMAPE);
              setShowMAE(false); // tutup yg lain
            }}
            className="text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
          >
            <MdInfo size={14} />
          </button>

          {showMAPE && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMAPE(false)} />
              <div className="absolute left-0 bottom-6 z-50 w-56 bg-gray-900 border border-white/10 rounded-xl p-3 shadow-xl text-xs text-white/80 leading-relaxed">
                Nilai tergolong {isGood ? <span className="text-green-400">baik</span> : <span className="text-amber-400">cukup</span>} {isGood ? "(<10%)." : "(≥10%)."}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
// ────────────────────────────────────────────────────────────────────────────

const MetricsCard = ({ title, metrics, color }) => (
  <motion.div variants={itemVariants} className={cardStyle}>
    <h4 className={`font-semibold mb-4 ${color}`}>{title}</h4>
    <div className="space-y-3">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="border-b border-white/5 pb-2 last:border-0">
          <p className="text-sm text-white font-medium capitalize mb-1 flex items-center gap-1">
            <CommodityLabel name={key} />
          </p>
          <p className="text-xs text-white/40 mb-1">Model: {value.model}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-white/60">
              RMSE: <span className="text-white">{value.rmse}</span>
            </span>
            <span className="text-white/60">
              MAE: <span className="text-white">{value.mae}</span>
            </span>
            <span className="text-white/60">
              MAPE: <span className="text-white">{value.mape}%</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function PrediksiPage() {
  const { isDark } = useTheme();
  const cGrid  = isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(135,169,107,0.25)';
  const cAxis  = isDark ? 'rgba(255,255,255,0.5)'  : '#4b5563';
  const cTick  = isDark ? 'rgba(255,255,255,0.5)'  : '#374151';
  const cTickD = isDark ? 'rgba(255,255,255,0.4)'  : '#6b7280';
  const cRef   = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(135,169,107,0.6)';
  const cGridS = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(135,169,107,0.2)';
  const cAxisS = isDark ? 'rgba(255,255,255,0.3)'  : '#6b7280';
  const cTickS = isDark ? 'rgba(255,255,255,0.45)' : '#4b5563';

  const [activeCategory, setActiveCategory] = useState("weather");
  const [selectedPrediction, setSelectedPrediction] = useState("suhu");
  const [timeRange, setTimeRange] = useState("30");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [dataSource, setDataSource] = useState("openweather");

  // Modal data aktual historis
  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const [allHistoricalData, setAllHistoricalData] = useState([]);
  const [loadingAllHistorical, setLoadingAllHistorical] = useState(false);
  const [filterMonthYear, setFilterMonthYear] = useState("all");

  const MONTH_NAMES_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const PREDICTION_TO_API_KEY = {
    jagung: "jagung", cabai: "cabe", cabe: "cabe", kedelai: "kedelai",
    berasPremium: "beras-premium", berasMedium: "beras-medium",
    berasSphp: "beras-sphp", minyakita: "minyakita", telur: "telur",
  };

  const handleViewAllHistorical = async () => {
    setShowHistoricalModal(true);
    setAllHistoricalData([]);
    setLoadingAllHistorical(true);
    setFilterMonthYear("all");
    const apiKey = PREDICTION_TO_API_KEY[selectedPrediction] || selectedPrediction;
    const data = await fetchHistoricalData(apiKey, 730); // ambil hingga 2 tahun ke belakang
    setAllHistoricalData(data || []);
    setLoadingAllHistorical(false);
  };

  const {
    currentWeather: liveWeather,
    forecast,
    loading: weatherLoading,
    error: weatherError,
    location,
    getForecastByDateTime,
    getAvailableDates,
    getAvailableTimes,
    getDailySummary,
    arimaxPrediction,
    predictionLoading,
    predictionError,
    fetchQuickPrediction,
    getArimaxDates,
    getArimaxTimes,
    getArimaxByDateTime,
    getArimaxDailySummary,
  } = useWeatherForecast();

  const { commodityData, historicalData, currentPrices: realCurrentPrices, loading: commodityLoading, error: commodityError, getChartData: getCommodityChartData, getPriceStats, fetchHistoricalData } = useCommodityForecast();

  useEffect(() => {
    if (forecast.length > 0 && !selectedDate && dataSource === "openweather") {
      const dates = getAvailableDates();
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
        const times = getAvailableTimes(dates[0]);
        if (times.length > 0) {
          setSelectedTime(times[0].value);
          setSelectedForecast(times[0].data);
        }
      }
    }
  }, [forecast, dataSource]);

  useEffect(() => {
    if (arimaxPrediction?.predictions?.length > 0 && dataSource === "arimax") {
      const dates = getArimaxDates();
      if (dates.length > 0) {
        const currentDateValid = dates.includes(selectedDate);
        const targetDate = currentDateValid ? selectedDate : dates[0];
        setSelectedDate(targetDate);
        const times = getArimaxTimes(targetDate);
        if (times.length > 0) {
          setSelectedTime(times[0].value);
          const firstPrediction = times[0].data;
          setSelectedForecast({
            ...firstPrediction,
            humidity: firstPrediction.humidity,
            windSpeed: liveWeather?.wind?.speed || 2,
            weather: liveWeather?.weather?.[0] || null,
            description: "Prediksi ARIMAX",
            feelsLike: firstPrediction.temp,
          });
        }
      }
    }
  }, [arimaxPrediction, dataSource]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      if (dataSource === "openweather") {
        const forecastData = getForecastByDateTime(selectedDate, selectedTime);
        setSelectedForecast(forecastData);
      } else {
        const arimaxData = getArimaxByDateTime(selectedDate, selectedTime);
        if (arimaxData) {
          setSelectedForecast({
            ...arimaxData,
            humidity: arimaxData.humidity,
            windSpeed: liveWeather?.wind?.speed || 2,
            weather: liveWeather?.weather?.[0] || null,
            description: "Prediksi ARIMAX",
            feelsLike: arimaxData.temp,
          });
        }
      }
    }
  }, [selectedDate, selectedTime, dataSource]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const openWeatherDates = getAvailableDates();
    const isAvailableInOpenWeather = openWeatherDates.includes(date);
    const targetSource = isAvailableInOpenWeather ? "openweather" : "arimax";
    setDataSource(targetSource);
    const times = targetSource === "openweather" ? getAvailableTimes(date) : getArimaxTimes(date);
    if (times.length > 0) {
      setSelectedTime(times[0].value);
    }
  };
  const getTrendDescription = (commodityKey) => {
    const stats = getPriceStats(commodityKey);
    if (!stats) return null;

    const change = parseFloat(stats.change);
    const absChange = Math.abs(change);
    const arah = stats.trend === "up" ? "naik" : "turun";

    if (absChange < 1) return `Harga diprediksi stabil dalam 30 hari ke depan`;
    if (absChange < 5) return `Harga diprediksi ${arah} ${absChange}% dalam 30 hari ke depan`;
    return `Harga diprediksi ${arah} signifikan ${absChange}% dalam 30 hari ke depan`;
  };
  const isSignificantIncrease = (commodityKey) => {
    const stats = getPriceStats(commodityKey);
    if (!stats) return false;
    return stats.trend === "up" && parseFloat(stats.change) >= 5;
  };
  const COMMODITY_KEY_MAP = {
    jagung: "jagung", cabai: "cabe", cabe: "cabe", kedelai: "kedelai",
    berasPremium: "berasPremium", berasMedium: "berasMedium",
    berasSphp: "berasSphp", minyakita: "minyakita", telur: "telur",
  };

  const getChartData = () => {
    if (activeCategory === "weather") {
      if (dataSource === "openweather" && forecast.length > 0) {
        return forecast.map((item) => ({
          label: `${item.date.split("/")[0]}/${item.date.split("/")[1]} ${item.time}`,
          month: item.time,
          suhuPredicted: item.temp,
          suhuLower: item.temp - 2,
          suhuUpper: item.temp + 2,
          kelembabanPredicted: item.humidity,
          kelembabanLower: item.humidity - 5,
          kelembabanUpper: item.humidity + 5,
          fullDate: item.date,
        }));
      } else if (dataSource === "arimax" && arimaxPrediction?.predictions?.length > 0) {
        const dataPoints = Math.min(168, arimaxPrediction.predictions.length);
        return arimaxPrediction.predictions.slice(0, dataPoints).map((item) => {
          const [, month, day] = item.date.split("-");
          const dateStr = `${day}/${month}`;
          return {
            label: `${dateStr} ${item.time}`,
            month: item.time,
            suhuPredicted: item.temp,
            suhuLower: item.temp - 2,
            suhuUpper: item.temp + 2,
            kelembabanPredicted: item.humidity,
            kelembabanLower: item.humidity - 5,
            kelembabanUpper: item.humidity + 5,
            fullDate: item.date,
          };
        });
      }
      return weatherForecastData;
    }

    const foodKeys = ["berasPremium", "berasMedium", "berasSphp", "minyakita", "telur"];
    const commodityKeys = ["jagung", "cabai", "cabe", "kedelai"];

    if (commodityKeys.includes(selectedPrediction) || foodKeys.includes(selectedPrediction)) {
      const commodityKey = COMMODITY_KEY_MAP[selectedPrediction] || selectedPrediction;
      let displayKey = selectedPrediction === "cabe" ? "cabai" : selectedPrediction;
      const limit = parseInt(timeRange) || 30;

      if (commodityData[commodityKey]?.forecast) {
        const forecastPoints = getCommodityChartData(commodityKey).slice(0, limit).map((item) => ({
          month: item.month,
          [`${displayKey}Predicted`]: item.predicted,
          [`${displayKey}Lower`]: item.lower,
          [`${displayKey}Upper`]: item.upper,
          bandSize: item.upper != null && item.lower != null ? item.upper - item.lower : null,
          bandBase: item.lower,
          actual: null,
        }));

        const histPoints = (historicalData?.[commodityKey] || []).map((item) => ({
          month: item.month,
          actual: item.price,
          [`${displayKey}Predicted`]: null,
          [`${displayKey}Lower`]: null,
          [`${displayKey}Upper`]: null,
          bandSize: null,
          bandBase: null,
        }));

        // Bridge: last historical point gets the same value as predicted start
        if (histPoints.length > 0 && forecastPoints.length > 0) {
          histPoints[histPoints.length - 1][`${displayKey}Predicted`] = histPoints[histPoints.length - 1].actual;
        }

        return [...histPoints, ...forecastPoints];
      }
      if (commodityKeys.includes(selectedPrediction)) return commodityForecastData;
      return otherCommodityData.slice(0, parseInt(timeRange) || 6);
    }
  };

  const getChartConfig = () => {
    const configs = {
      suhu: { lower: "suhuLower", upper: "suhuUpper", predicted: "suhuPredicted", color: COLORS.temperature, unit: "°C", label: "Suhu" },
      kelembaban: { lower: "kelembabanLower", upper: "kelembabanUpper", predicted: "kelembabanPredicted", color: COLORS.humidity, unit: "%", label: "Kelembaban" },
      jagung: { lower: "jagungLower", upper: "jagungUpper", predicted: "jagungPredicted", color: COLORS.jagung, unit: "Rp/kg", label: "Jagung" },
      cabai: { lower: "cabaiLower", upper: "cabaiUpper", predicted: "cabaiPredicted", color: COLORS.cabai, unit: "Rp/kg", label: "Cabai Rawit" },
      kedelai: { lower: "kedelaiLower", upper: "kedelaiUpper", predicted: "kedelaiPredicted", color: COLORS.kedelai, unit: "Rp/kg", label: "Kedelai" },
      berasPremium: { lower: "berasPremiumLower", upper: "berasPremiumUpper", predicted: "berasPremiumPredicted", color: COLORS.berasPremium, unit: "Rp/kg", label: "Beras Premium" },
      berasMedium: { lower: "berasMediumLower", upper: "berasMediumUpper", predicted: "berasMediumPredicted", color: COLORS.berasMedium, unit: "Rp/kg", label: "Beras Medium" },
      berasSphp: { lower: "berasSphpLower", upper: "berasSphpUpper", predicted: "berasSphpPredicted", color: COLORS.berasSphp, unit: "Rp/kg", label: "Beras SPHP Bulog" },
      minyakita: { lower: "minyakitaLower", upper: "minyakitaUpper", predicted: "minyakitaPredicted", color: COLORS.minyakita, unit: "Rp/L", label: "Minyak MINYAKITA" },
      telur: { lower: "telurLower", upper: "telurUpper", predicted: "telurPredicted", color: COLORS.telur, unit: "Rp/kg", label: "Telur Ayam Ras" },
    };
    return configs[selectedPrediction] || configs.suhu;
  };

  const chartData = getChartData();
  const chartConfig = getChartConfig();

  const yDomain = (() => {
    if (!chartData || chartData.length === 0 || activeCategory === "weather") return ["auto", "auto"];
    const predicted = chartData.map((d) => d[chartConfig.predicted]).filter((v) => v != null && !isNaN(v));
    const actual = chartData.map((d) => d.actual).filter((v) => v != null && !isNaN(v));
    const values = [...predicted, ...actual];
    if (values.length === 0) return ["auto", "auto"];
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [Math.floor(min * 0.75), Math.ceil(max * 1.25)];
  })();

  return (
    <>
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="min-h-screen bg-gradient-to-br from-[#EAF0DE] via-[#F0F5E8] to-[#EAF0DE] dark:from-black dark:via-gray-900 dark:to-black pt-24 px-4 md:px-8 pb-8 text-gray-900 dark:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold pb-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">Prediksi & Peramalan</h2>
                <p className="text-gray-700 dark:text-white/50 text-sm md:text-base">Model prediktif berbasis AI untuk harga pangan dan kondisi iklim</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setActiveCategory("weather");
                  setSelectedPrediction("suhu");
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "weather" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25" : "bg-[#F0EDE5] dark:bg-white/5 text-gray-500 dark:text-white/60 hover:bg-[#E8E4DA] dark:hover:bg-white/10 border border-[#87a96b]/40 dark:border-white/10"
                }`}
              >
                <IoCloudOutline size={16} /> Cuaca
              </button>
              <button
                onClick={() => {
                  setActiveCategory("commodity");
                  setSelectedPrediction("jagung");
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "commodity" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25" : "bg-[#F0EDE5] dark:bg-white/5 text-gray-500 dark:text-white/60 hover:bg-[#E8E4DA] dark:hover:bg-white/10 border border-[#87a96b]/40 dark:border-white/10"
                }`}
              >
                <FaSeedling size={14} /> Harga Komoditas
              </button>
              <button
                onClick={() => {
                  setActiveCategory("food");
                  setSelectedPrediction("berasPremium");
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "food" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25" : "bg-[#F0EDE5] dark:bg-white/5 text-gray-500 dark:text-white/60 hover:bg-[#E8E4DA] dark:hover:bg-white/10 border border-[#87a96b]/40 dark:border-white/10"
                }`}
              >
                <FaBowlRice size={16} /> Harga Bahan Pangan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Bar */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-[#87a96b]/40 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700 dark:text-white/60">
            <span className="flex items-center gap-1.5">
              <MdAccessTime size={14} /> <span className="text-gray-700 dark:text-white/80">Terakhir diperbarui:</span> 18 Apr 2026
            </span>
            <span className="hidden sm:block text-gray-300 dark:text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <MdCalendarMonth size={14} /> <span className="text-gray-700 dark:text-white/80">Periode:</span> Apr 2025 - Apr 2026
            </span>
            <span className="hidden sm:block text-gray-300 dark:text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <MdAccountBalance size={14} /> <span className="text-gray-700 dark:text-white/80">Sumber:</span> BMKG, Siskaperbapo
            </span>
          </div>
          <div className="text-xs text-amber-400/80 flex items-center gap-1.5">
            <MdWarning size={14} /> Prediksi dapat berubah tergantung kondisi aktual
          </div>
        </motion.div>

        {/* Category Cards */}
        <motion.div variants={itemVariants} className={`${cardStyle}`}>
          <div className={`grid gap-4 ${activeCategory === "weather" ? "grid-cols-1 md:grid-cols-2" : activeCategory === "commodity" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-5"}`}>
            {activeCategory === "weather" ? (
              <div className="col-span-full">
                {weatherLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-400"></div>
                    <span className="ml-3 text-gray-700 dark:text-white/60">Memuat data cuaca...</span>
                  </div>
                ) : weatherError ? (
                  <div className="bg-red-500/10 rounded-xl p-4 text-center text-red-400">Error: {weatherError}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <MdLocationOn className="text-2xl text-green-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Desa {location}, Kab.Blitar</h4>
                      </div>
                      {liveWeather && (
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl">
                          <span className="text-gray-500 dark:text-white/60 text-sm">Saat ini:</span>
                          <span className="text-xl font-bold text-green-500 dark:text-green-400">{Math.round(liveWeather.main.temp)}°C</span>
                          <span className="text-gray-300 dark:text-white/60">|</span>
                          <span className="text-blue-500 dark:text-blue-400">{liveWeather.main.humidity}%</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/60 mb-2">
                          <MdCalendarMonth size={14} /> Pilih Tanggal
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          min={getAvailableDates()[0]}
                          max={getArimaxDates().length > 0 ? getArimaxDates().slice(-1)[0] : getAvailableDates().slice(-1)[0]}
                          className="w-full bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/60 mb-2">
                          <MdAccessTime size={14} /> Pilih Jam
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                          style={{ colorScheme: "dark" }}
                        >
                          {(dataSource === "openweather" ? getAvailableTimes(selectedDate) : getArimaxTimes(selectedDate)).map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {selectedForecast && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-red-500/20 to-orange-500/10 rounded-xl p-4 border border-red-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <WiThermometer className="text-3xl text-red-400" />
                            <span className="text-sm text-gray-700 dark:text-white/60">Suhu</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedForecast.temp}°C</p>
                          <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Terasa seperti {selectedForecast.feelsLike}°C</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <BsDropletFill className="text-xl text-blue-400" />
                            <span className="text-sm text-gray-700 dark:text-white/60">Kelembaban</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedForecast.humidity}%</p>
                          <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Tingkat kelembaban udara</p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : activeCategory === "commodity" ? (
              <>
                {/* Jagung */}
                <div
                  onClick={() => setSelectedPrediction("jagung")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative ${selectedPrediction === "jagung" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  {isSignificantIncrease("jagung") && (
                    <div className="absolute top-3 right-3">
                      <MdWarning className="text-amber-400" size={18} />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <GiCorn /> Prediksi Harga Jagung
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.jagung.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.jagung.mae} mape={modelMetrics.commodities.jagung.mape} />
                  <p className="text-xs text-orange-400">{getTrendDescription("jagung")}</p>
                </div>

                {/* Cabai */}
                <div
                  onClick={() => setSelectedPrediction("cabai")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative ${selectedPrediction === "cabai" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  {isSignificantIncrease("cabe") && (
                    <div className="absolute top-3 right-3">
                      <MdWarning className="text-amber-400" size={18} />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaPepperHot /> Prediksi Harga Cabai
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.cabai.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.cabai.mae} mape={modelMetrics.commodities.cabai.mape} />
                  <p className="text-xs text-orange-400">{getTrendDescription("cabe")}</p>
                </div>

                {/* Kedelai */}
                <div
                  onClick={() => setSelectedPrediction("kedelai")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative ${selectedPrediction === "kedelai" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  {isSignificantIncrease("kedelai") && (
                    <div className="absolute top-3 right-3">
                      <MdWarning className="text-amber-400" size={18} />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Bean size={16} /> Prediksi Harga Kedelai
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.kedelai.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.kedelai.mae} mape={modelMetrics.commodities.kedelai.mape} />
                  <p className="text-xs text-orange-400">{getTrendDescription("kedelai")}</p>
                </div>
              </>
            ) : (
              <>
                {/* Beras Premium */}
                <div
                  onClick={() => setSelectedPrediction("berasPremium")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "berasPremium" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaBowlRice /> Beras Premium
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.berasPremium.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.berasPremium.mae} mape={modelMetrics.commodities.berasPremium.mape} />
                </div>
                {/* Beras Medium */}
                <div
                  onClick={() => setSelectedPrediction("berasMedium")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "berasMedium" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaBowlRice /> Beras Medium
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.berasMedium.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.berasMedium.mae} mape={modelMetrics.commodities.berasMedium.mape} />
                </div>
                {/* Beras SPHP Bulog */}
                <div
                  onClick={() => setSelectedPrediction("berasSphp")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "berasSphp" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaBowlRice /> Beras SPHP Bulog
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.berasSphp.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.berasSphp.mae} mape={modelMetrics.commodities.berasSphp.mape} />
                </div>
                {/* MINYAKITA */}
                <div
                  onClick={() => setSelectedPrediction("minyakita")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "minyakita" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaBottleWater /> MINYAKITA
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.minyakita.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.minyakita.mae} mape={modelMetrics.commodities.minyakita.mape} unit="Rp/L" />
                </div>
                {/* Telur */}
                <div
                  onClick={() => setSelectedPrediction("telur")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "telur" ? "bg-[#E8F0DC] dark:bg-white/10 border-[#87a96b]/60" : "bg-white dark:bg-white/5 border-[#87a96b]/40 dark:border-white/10 hover:bg-[#EDE9E0] dark:hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaEgg /> Telur Ayam
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{modelMetrics.commodities.telur.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.telur.mae} mape={modelMetrics.commodities.telur.mape} />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Main Chart */}
        <motion.div variants={itemVariants} className={`${cardStyle} overflow-visible`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Prediksi {chartConfig.label}</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-700 dark:text-white/50">{activeCategory === "weather" ? "Nilai saat ini:" : "Harga saat ini:"}</span>
                <span className="text-lg font-bold text-green-400">
                  {activeCategory === "weather"
                    ? selectedPrediction === "suhu"
                      ? `${currentWeather.suhu}°C`
                      : `${currentWeather.kelembaban}%`
                    : activeCategory === "commodity"
                      ? formatCurrency(realCurrentPrices[selectedPrediction === "cabai" ? "cabe" : selectedPrediction] || currentPrices[selectedPrediction])
                      : formatCurrency(realCurrentPrices[selectedPrediction] || currentPrices[selectedPrediction])}
                </span>
                {(activeCategory === "commodity" || activeCategory === "food") && <span className="text-gray-400 dark:text-white/40 text-xs">{chartConfig.unit === "Rp/L" ? "/L" : "/kg"}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeCategory === "commodity" && (
                <select
                  value={selectedPrediction}
                  onChange={(e) => setSelectedPrediction(e.target.value)}
                  className="bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="jagung">Jagung</option>
                  <option value="cabai">Cabai Rawit</option>
                  <option value="kedelai">Kedelai</option>
                </select>
              )}
              {activeCategory === "food" && (
                <select
                  value={selectedPrediction}
                  onChange={(e) => setSelectedPrediction(e.target.value)}
                  className="bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="berasPremium">Beras Premium</option>
                  <option value="berasMedium">Beras Medium</option>
                  <option value="berasSphp">Beras SPHP Bulog</option>
                  <option value="minyakita">Minyak MINYAKITA</option>
                  <option value="telur">Telur Ayam Ras</option>
                </select>
              )}
              {activeCategory === "weather" && (
                <select
                  value={selectedPrediction}
                  onChange={(e) => setSelectedPrediction(e.target.value)}
                  className="bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="suhu">Suhu</option>
                  <option value="kelembaban">Kelembaban</option>
                </select>
              )}
              {activeCategory !== "weather" && (
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="3">3 hari</option>
                  <option value="7">7 hari</option>
                  <option value="14">14 hari</option>
                  <option value="28">28 hari</option>
                  <option value="30">30 hari</option>
                </select>
              )}
              {activeCategory !== "weather" && (
                <button
                  onClick={handleViewAllHistorical}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#F0EDE5] dark:bg-white/5 border border-[#87a96b]/40 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-[#E8E4DA] dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:border-green-500/40 transition-all duration-200"
                >
                  <MdHistory size={16} />
                  Data Aktual Lengkap
                </button>
              )}
            </div>
          </div>

          {(() => {
            const cutoffLabel = (() => {
              if (activeCategory === "weather" || !chartData) return null;
              const last = [...chartData].reverse().find((d) => d.actual != null);
              return last?.month ?? null;
            })();
            const hasActual = activeCategory !== "weather" && chartData?.some((d) => d.actual != null);

            const sharedAxes = (
              <>
                <CartesianGrid strokeDasharray="3 3" stroke={cGrid} vertical={false} />
                <XAxis
                  dataKey={activeCategory === "weather" ? "label" : "month"}
                  stroke={cAxis}
                  tick={{ fill: cTick, fontSize: 12 }}
                  tickFormatter={(value) => (activeCategory === "weather" ? value.split(" ")[1] : value)}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke={cAxis}
                  tick={{ fill: cTick, fontSize: 12 }}
                  domain={yDomain}
                  label={
                    activeCategory !== "weather"
                      ? { value: chartConfig.unit, angle: -90, position: "insideLeft", offset: 10, style: { fill: cTickD, fontSize: 12 } }
                      : undefined
                  }
                  tickFormatter={(value) => (activeCategory === "weather" ? value : value.toLocaleString("id-ID"))}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "#ffffff" }}
                  formatter={(value, name) => {
                    if (value == null) return [null, name];
                    if (name === "Harga Aktual") return [formatCurrency(value), name];
                    return [activeCategory === "weather" ? `${value}${chartConfig.unit}` : formatCurrency(value), "Prediksi Harga"];
                  }}
                  labelFormatter={(label) => (activeCategory === "weather" ? `Waktu: ${label}` : `Tanggal: ${label}`)}
                />
              </>
            );

            return (
              <ResponsiveContainer width="100%" height={420}>
                {activeCategory === "weather" ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`color${selectedPrediction}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    {sharedAxes}
                    <Legend verticalAlign="bottom" height={36} formatter={() => "Prediksi Nilai"} />
                    <Area type="monotone" dataKey={chartConfig.predicted} stroke={chartConfig.color} strokeWidth={2} fill={`url(#color${selectedPrediction})`} fillOpacity={0.5} />
                  </AreaChart>
                ) : (
                  <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                    <defs>
                      <linearGradient id={`color${selectedPrediction}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={cGrid} vertical={false} />
                    <XAxis dataKey="month" stroke={cAxis} tick={{ fill: cTick, fontSize: 12 }} interval="preserveStartEnd" />
                    <YAxis stroke={cAxis} tick={{ fill: cTick, fontSize: 12 }} domain={yDomain} label={{ value: chartConfig.unit, angle: -90, position: "insideLeft", offset: 10, style: { fill: cTickD, fontSize: 12 } }} tickFormatter={(v) => v.toLocaleString("id-ID")} />
                    <Tooltip content={<PriceTooltip unit={chartConfig.unit} />} />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      formatter={(value) => (value === "Harga Aktual" ? "Harga Aktual" : "Prediksi Harga")}
                    />
                    {/* Predicted forecast line */}
                    <Line type="monotone" dataKey={chartConfig.predicted} stroke={chartConfig.color} strokeWidth={2} strokeDasharray={hasActual ? "5 4" : "0"} dot={false} name="Prediksi Harga" connectNulls={false} />
                    {/* Actual historical line */}
                    {hasActual && <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={false} name="Harga Aktual" connectNulls={false} />}
                    {/* Shading untuk zona prediksi */}
                    {cutoffLabel && (
                      <ReferenceArea
                        x1={cutoffLabel}
                        fill={isDark ? "rgba(135,169,107,0.12)" : "rgba(135,169,107,0.15)"}
                        strokeOpacity={0}
                      />
                    )}
                    {/* Cutoff reference line with label */}
                    {cutoffLabel && (
                      <ReferenceLine x={cutoffLabel} stroke={isDark ? "#87a96b" : "#5a7a42"} strokeWidth={2} strokeDasharray="5 3"
                        label={{ value: "◀ Aktual  |  Prediksi ▶", fill: isDark ? "#a3c47a" : "#5a7a42", fontSize: 10, position: "insideTopRight", dy: -6 }}
                      />
                    )}
                    {/* Zoom/pan brush */}
                    <Brush
                      dataKey="month"
                      height={24}
                      stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(135,169,107,0.4)"}
                      fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(234,240,222,0.8)"}
                      travellerWidth={6}
                      tickFormatter={() => ""}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            );
          })()}
        </motion.div>
      </div>
    </motion.div>

    {/* ── Modal Data Aktual Lengkap ────────────────────────────────────────── */}
    {showHistoricalModal && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowHistoricalModal(false)}
        />

        {/* Modal container */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FAFAF7] dark:bg-gray-950 border border-[#87a96b]/40 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col pointer-events-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#87a96b]/40 dark:border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MdHistory size={20} className="text-green-400" />
                  Data Aktual Historis — {chartConfig.label}
                </h3>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">Seluruh data harga aktual yang tersedia (maks. 365 hari)</p>
              </div>
              <button
                onClick={() => setShowHistoricalModal(false)}
                className="p-2 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-[#EDE9E0] dark:hover:bg-white/10 transition-all"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {loadingAllHistorical ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-400" />
                  <span className="ml-3 text-gray-700 dark:text-white/60">Memuat data historis...</span>
                </div>
              ) : allHistoricalData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-white/30 gap-3">
                  <MdHistory size={40} />
                  <p>Tidak ada data historis tersedia</p>
                </div>
              ) : (
                <>
                  {/* Statistik ringkas — ikuti filter bulan */}
                  {(() => {
                    const filtered = filterMonthYear === "all"
                      ? allHistoricalData
                      : allHistoricalData.filter(d => d.date?.startsWith(filterMonthYear));
                    const prices = filtered.map(d => d.price);
                    if (prices.length === 0) return null;
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
                    const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
                    return (
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Terendah", value: fmt(min), color: "text-blue-400" },
                          { label: "Rata-rata", value: fmt(avg), color: "text-gray-900 dark:text-white" },
                          { label: "Tertinggi", value: fmt(max), color: "text-amber-400" },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="bg-[#F0EDE5] dark:bg-white/5 rounded-xl px-4 py-3 border border-gray-200 dark:border-white/5">
                            <p className="text-xs text-gray-400 dark:text-white/40 mb-1">{label}</p>
                            <p className={`text-sm font-semibold ${color}`}>{value}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Chart — selalu tampilkan semua data sebagai overview */}
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={allHistoricalData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={cGridS} vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke={cAxisS}
                        tick={{ fill: cTickS, fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke={cAxisS}
                        tick={{ fill: cTickS, fontSize: 11 }}
                        tickFormatter={(v) => v.toLocaleString("id-ID")}
                        label={{ value: chartConfig.unit, angle: -90, position: "insideLeft", offset: 10, style: { fill: cAxisS, fontSize: 11 } }}
                        width={70}
                      />
                      <Tooltip content={<PriceTooltip unit={chartConfig.unit} />} />
                      <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} name="Harga Aktual" connectNulls={false} />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Filter bulan/tahun + Tabel */}
                  {(() => {
                    // Kumpulkan tahun & bulan unik dari data
                    const allYM = [...new Set(allHistoricalData.map(d => d.date?.slice(0, 7)).filter(Boolean))].sort().reverse();
                    const uniqueYears = [...new Set(allYM.map(ym => ym.slice(0, 4)))];
                    const [selYear, selMonth] = filterMonthYear === "all" ? ["all", "all"] : filterMonthYear.split("-");

                    // Bulan tersedia untuk tahun terpilih
                    const availableMonths = selYear === "all"
                      ? []
                      : [...new Set(allYM.filter(ym => ym.startsWith(selYear)).map(ym => ym.slice(5, 7)))].sort();

                    const handleYearChange = (y) => {
                      if (y === "all") { setFilterMonthYear("all"); }
                      else { setFilterMonthYear(`${y}-all`); }
                    };
                    const handleMonthChange = (m) => {
                      if (m === "all") { setFilterMonthYear(selYear === "all" ? "all" : `${selYear}-all`); }
                      else { setFilterMonthYear(`${selYear}-${m}`); }
                    };

                    // Filter baris tabel
                    const filteredRows = (() => {
                      let rows = [...allHistoricalData].reverse();
                      if (selYear !== "all") rows = rows.filter(d => d.date?.startsWith(selYear));
                      if (selMonth !== "all" && selMonth) rows = rows.filter(d => d.date?.slice(5, 7) === selMonth);
                      return rows;
                    })();

                    return (
                      <div className="space-y-3">
                        {/* Filter row */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-gray-400 dark:text-white/40 whitespace-nowrap">Filter:</span>
                          {/* Dropdown Tahun */}
                          <select
                            value={selYear}
                            onChange={(e) => handleYearChange(e.target.value)}
                            className="bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50"
                            style={{ colorScheme: "dark" }}
                          >
                            <option value="all">Semua Tahun</option>
                            {uniqueYears.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          {/* Dropdown Bulan — hanya aktif jika tahun dipilih */}
                          <select
                            value={selMonth || "all"}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            disabled={selYear === "all"}
                            className="bg-white dark:bg-gray-900 border border-[#87a96b]/45 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500/50 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ colorScheme: "dark" }}
                          >
                            <option value="all">Semua Bulan</option>
                            {availableMonths.map(m => (
                              <option key={m} value={m}>{MONTH_NAMES_ID[parseInt(m) - 1]}</option>
                            ))}
                          </select>
                          {/* Tombol reset */}
                          {filterMonthYear !== "all" && (
                            <button
                              onClick={() => setFilterMonthYear("all")}
                              className="text-xs text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 transition-colors underline underline-offset-2"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Tabel */}
                        <div className="rounded-xl border border-[#87a96b]/40 dark:border-white/10 overflow-hidden">
                          <div className="max-h-56 overflow-y-auto">
                            <table className="w-full text-sm">
                              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 z-10">
                                <tr className="border-b border-[#87a96b]/40 dark:border-white/10">
                                  <th className="text-left text-gray-400 dark:text-white/40 font-medium py-2.5 px-4">#</th>
                                  <th className="text-left text-gray-400 dark:text-white/40 font-medium py-2.5 px-4">Tanggal</th>
                                  <th className="text-right text-gray-400 dark:text-white/40 font-medium py-2.5 px-4">Harga Aktual</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredRows.length === 0 ? (
                                  <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-400 dark:text-white/30 text-sm">
                                      Tidak ada data untuk bulan ini
                                    </td>
                                  </tr>
                                ) : (
                                  filteredRows.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-[#F0EDE5] dark:hover:bg-white/5 transition-colors">
                                      <td className="py-2 px-4 text-gray-300 dark:text-white/25 text-xs">{filteredRows.length - i}</td>
                                      <td className="py-2 px-4 text-gray-700 dark:text-white/60">
                                        {item.date
                                          ? new Date(item.date + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
                                          : item.month}
                                      </td>
                                      <td className="py-2 px-4 text-right font-medium text-green-500 dark:text-green-400">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.price)}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 dark:text-white/25 text-right">{filteredRows.length} data ditampilkan</p>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </>
    )}
    </>
  );
}
