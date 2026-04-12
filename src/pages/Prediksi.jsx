import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import useWeatherForecast from "../hooks/useWeatherForecast";
import useCommodityForecast from "../hooks/useCommodityForecast";
import WeatherIcon from "../components/WeatherIcon";
import { WiThermometer, WiHumidity } from "react-icons/wi";
import { FaSeedling, FaPepperHot, FaBottleWater, FaEgg, FaBowlRice } from "react-icons/fa6";
import { GiCorn } from "react-icons/gi";
import { Bean } from "lucide-react";
import { MdLocationOn, MdAccessTime, MdCalendarMonth, MdAccountBalance, MdWarning, MdOutlineWaterDrop, MdInfo } from "react-icons/md";
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
  minyakPremium: "#fde047",
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const cardStyle = `
  bg-gradient-to-br from-green-400/5 via-blue-500/5 to-purple-500/5 
  backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl p-6
  hover:shadow-green-500/10 hover:border-white/20 transition-all duration-300
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
    minyakPremiumLower: 18000,
    minyakPremiumUpper: 19500,
    minyakPremiumPredicted: 18800,
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
    suhu: { model: "ARIMAX", mse: 1.62, mae: 0.96, mape: 3.44 },
    kelembaban: { model: "LSTM", mse: 88.7, mae: 7.17, mape: 8.69 },
  },
  commodities: {
    jagung: { model: "LSTM", mse: 9, mae: 3, mape: 0.04 },
    cabai: { model: "LSTM", mse: 3.8e6, mae: 1532, mape: 6.31 },
    kedelai: { model: "LSTM", mse: 5.18e5, mae: 259, mape: 1.85 },
    berasPremium: { model: "ExtraTrees Regressor", mse: 1835, mae: 23.15, mape: 0.16 },
    berasMedium: { model: "LSTM", mse: 17.2, mae: 4.01, mape: 0.03 },
    minyakPremium: { model: "ARIMAX", mse: 2053, mae: 195.03, mape: 0.97 },
    minyakita: { model: "ARIMAX", mse: 593.9, mae: 39.4, mape: 0.251 },
    telur: { model: "ExtraTrees Regressor", mse: 5.94e5, mae: 551.49, mape: 1.94 },
  },
};

const predictionSummary = {
  suhu: { current: 28, trend: "+1.5°C", trendUp: true, description: "Suhu meningkat moderat hingga April" },
  kelembaban: { current: 78, trend: "-5%", trendUp: false, description: "Kelembaban menurun menuju musim kemarau" },
  jagung: { current: 5500, trend: "+3.2%", trendUp: true, description: "Harga stabil dengan kenaikan moderat" },
  cabai: { current: 50000, trend: "+26%", trendUp: true, description: "Kenaikan signifikan diprediksi Jan-Feb", warning: true },
  kedelai: { current: 12200, trend: "+4.1%", trendUp: true, description: "Tren naik stabil hingga Februari" },
};

const currentPrices = {
  jagung: 5500,
  cabai: 50000,
  kedelai: 12200,
  berasPremium: 14600,
  berasMedium: 13000,
  minyakPremium: 18800,
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
    minyakPremium: (
      <>
        <FaBottleWater className="inline mr-1" /> Minyak Goreng Premium
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
          <span className="text-sm font-medium text-blue-300">
            MAE: {mae}
            <span className="text-xs font-normal text-white/40"> {unit}</span>
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMAE(!showMAE);
                setShowMAPE(false); // tutup yg lain
              }}
              className="text-white/30 hover:text-white/70 transition-colors"
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
            className="text-white/30 hover:text-white/70 transition-colors"
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
  const [activeCategory, setActiveCategory] = useState("weather");
  const [selectedPrediction, setSelectedPrediction] = useState("suhu");
  const [timeRange, setTimeRange] = useState("30");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [dataSource, setDataSource] = useState("openweather");

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

  const { commodityData, currentPrices: realCurrentPrices, loading: commodityLoading, error: commodityError, getChartData: getCommodityChartData, getPriceStats } = useCommodityForecast();

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
          const [year, month, day] = item.date.split("-");
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

    const foodKeys = ["berasPremium", "berasMedium", "minyakPremium", "minyakita", "telur"];
    const commodityKeys = ["jagung", "cabai", "cabe", "kedelai"];

    if (commodityKeys.includes(selectedPrediction) || foodKeys.includes(selectedPrediction)) {
      const commodityKeyMap = {
        jagung: "jagung",
        cabai: "cabe",
        cabe: "cabe",
        kedelai: "kedelai",
        berasPremium: "berasPremium",
        berasMedium: "berasMedium",
        minyakPremium: "minyakPremium",
        minyakita: "minyakita",
        telur: "telur",
      };
      const commodityKey = commodityKeyMap[selectedPrediction] || selectedPrediction;
      if (commodityData[commodityKey]?.forecast) {
        const chartData = getCommodityChartData(commodityKey);
        let displayKey = selectedPrediction;
        if (selectedPrediction === "cabe") displayKey = "cabai";
        const limit = parseInt(timeRange) || 30;
        return chartData.slice(0, limit).map((item) => ({
          month: item.month,
          [`${displayKey}Predicted`]: item.predicted,
          [`${displayKey}Lower`]: item.lower,
          [`${displayKey}Upper`]: item.upper,
        }));
      }
      if (commodityKeys.includes(selectedPrediction)) return commodityForecastData;
      const limit = parseInt(timeRange) || 6;
      return otherCommodityData.slice(0, limit);
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
      minyakPremium: { lower: "minyakPremiumLower", upper: "minyakPremiumUpper", predicted: "minyakPremiumPredicted", color: COLORS.minyakPremium, unit: "Rp/L", label: "Minyak Goreng Premium" },
      minyakita: { lower: "minyakitaLower", upper: "minyakitaUpper", predicted: "minyakitaPredicted", color: COLORS.minyakita, unit: "Rp/L", label: "Minyak MINYAKITA" },
      telur: { lower: "telurLower", upper: "telurUpper", predicted: "telurPredicted", color: COLORS.telur, unit: "Rp/kg", label: "Telur Ayam Ras" },
    };
    return configs[selectedPrediction] || configs.suhu;
  };

  const chartData = getChartData();
  const chartConfig = getChartConfig();

  const yDomain = (() => {
    if (!chartData || chartData.length === 0 || activeCategory === "weather") return ["auto", "auto"];
    const values = chartData.map((d) => d[chartConfig.predicted]).filter((v) => v != null && !isNaN(v));
    if (values.length === 0) return ["auto", "auto"];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = range > 0 ? range * 0.5 : max * 0.005;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  })();

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 px-4 md:px-8 pb-8 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold pb-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent inline-block">Prediksi & Peramalan</h2>
                <p className="text-white/50 text-sm md:text-base">Model prediktif berbasis AI untuk harga pangan dan kondisi iklim</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setActiveCategory("weather");
                  setSelectedPrediction("suhu");
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "weather" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25" : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
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
                  activeCategory === "commodity" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25" : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
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
                  activeCategory === "food" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25" : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                }`}
              >
                <FaBowlRice size={16} /> Harga Bahan Pangan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Bar */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <MdAccessTime size={14} /> <span className="text-white/80">Terakhir diperbarui:</span> 11 Mar 2026, 22:00 WIB
            </span>
            <span className="hidden sm:block text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <MdCalendarMonth size={14} /> <span className="text-white/80">Periode:</span> Apr 2025 - Mar 2026
            </span>
            <span className="hidden sm:block text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <MdAccountBalance size={14} /> <span className="text-white/80">Sumber:</span> BMKG, Siskaperbapo
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
                    <span className="ml-3 text-white/60">Memuat data cuaca...</span>
                  </div>
                ) : weatherError ? (
                  <div className="bg-red-500/10 rounded-xl p-4 text-center text-red-400">Error: {weatherError}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <MdLocationOn className="text-2xl text-green-400" />
                        <h4 className="font-semibold text-white text-lg">Desa {location}, Kab.Blitar</h4>
                      </div>
                      {liveWeather && (
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                          <span className="text-white/60 text-sm">Saat ini:</span>
                          <span className="text-xl font-bold text-green-400">{Math.round(liveWeather.main.temp)}°C</span>
                          <span className="text-white/60">|</span>
                          <span className="text-blue-400">{liveWeather.main.humidity}%</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-white/60 mb-2">
                          <MdCalendarMonth size={14} /> Pilih Tanggal
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          min={getAvailableDates()[0]}
                          max={getArimaxDates().length > 0 ? getArimaxDates().slice(-1)[0] : getAvailableDates().slice(-1)[0]}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-white/60 mb-2">
                          <MdAccessTime size={14} /> Pilih Jam
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
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
                            <span className="text-sm text-white/60">Suhu</span>
                          </div>
                          <p className="text-3xl font-bold text-white">{selectedForecast.temp}°C</p>
                          <p className="text-xs text-white/50 mt-1">Terasa seperti {selectedForecast.feelsLike}°C</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <BsDropletFill className="text-xl text-blue-400" />
                            <span className="text-sm text-white/60">Kelembaban</span>
                          </div>
                          <p className="text-3xl font-bold text-white">{selectedForecast.humidity}%</p>
                          <p className="text-xs text-white/50 mt-1">Tingkat kelembaban udara</p>
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
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative ${selectedPrediction === "jagung" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  {isSignificantIncrease("jagung") && (
                    <div className="absolute top-3 right-3">
                      <MdWarning className="text-amber-400" size={18} />
                    </div>
                  )}
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <GiCorn /> Prediksi Harga Jagung
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.jagung.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.jagung.mae} mape={modelMetrics.commodities.jagung.mape} />
                  <p className="text-xs text-orange-400">{getTrendDescription("jagung")}</p>
                </div>

                {/* Cabai */}
                <div
                  onClick={() => setSelectedPrediction("cabai")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative ${selectedPrediction === "cabai" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  {isSignificantIncrease("cabe") && (
                    <div className="absolute top-3 right-3">
                      <MdWarning className="text-amber-400" size={18} />
                    </div>
                  )}
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <FaPepperHot /> Prediksi Harga Cabai
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.cabai.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.cabai.mae} mape={modelMetrics.commodities.cabai.mape} />
                  <p className="text-xs text-orange-400">{getTrendDescription("cabe")}</p>
                </div>

                {/* Kedelai */}
                <div
                  onClick={() => setSelectedPrediction("kedelai")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative ${selectedPrediction === "kedelai" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  {isSignificantIncrease("kedelai") && (
                    <div className="absolute top-3 right-3">
                      <MdWarning className="text-amber-400" size={18} />
                    </div>
                  )}
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <Bean size={16} /> Prediksi Harga Kedelai
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.kedelai.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.kedelai.mae} mape={modelMetrics.commodities.kedelai.mape} />
                  <p className="text-xs text-orange-400">{getTrendDescription("kedelai")}</p>
                </div>
              </>
            ) : (
              <>
                {/* Beras Premium */}
                <div
                  onClick={() => setSelectedPrediction("berasPremium")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "berasPremium" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <FaBowlRice /> Beras Premium
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.berasPremium.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.berasPremium.mae} mape={modelMetrics.commodities.berasPremium.mape} />
                </div>
                {/* Beras Medium */}
                <div
                  onClick={() => setSelectedPrediction("berasMedium")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "berasMedium" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <FaBowlRice /> Beras Medium
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.berasMedium.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.berasMedium.mae} mape={modelMetrics.commodities.berasMedium.mape} />
                </div>
                {/* Minyak Premium */}
                <div
                  onClick={() => setSelectedPrediction("minyakPremium")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "minyakPremium" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <FaBottleWater /> Minyak Premium
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.minyakPremium.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.minyakPremium.mae} mape={modelMetrics.commodities.minyakPremium.mape} unit="Rp/L" />
                </div>
                {/* MINYAKITA */}
                <div
                  onClick={() => setSelectedPrediction("minyakita")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "minyakita" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <FaBottleWater /> MINYAKITA
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.minyakita.model}</p>
                  <MapeBadge mae={modelMetrics.commodities.minyakita.mae} mape={modelMetrics.commodities.minyakita.mape} unit="Rp/L" />
                </div>
                {/* Telur */}
                <div
                  onClick={() => setSelectedPrediction("telur")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedPrediction === "telur" ? "bg-white/10 border-green-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                    <FaEgg /> Telur Ayam
                  </h4>
                  <p className="text-xs text-white/40 mb-2">{modelMetrics.commodities.telur.model}</p>
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
              <h3 className="text-xl font-semibold text-white mb-1">Prediksi {chartConfig.label}</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-white/50">{activeCategory === "weather" ? "Nilai saat ini:" : "Harga saat ini:"}</span>
                <span className="text-lg font-bold text-green-400">
                  {activeCategory === "weather"
                    ? selectedPrediction === "suhu"
                      ? `${currentWeather.suhu}°C`
                      : `${currentWeather.kelembaban}%`
                    : activeCategory === "commodity"
                      ? formatCurrency(realCurrentPrices[selectedPrediction === "cabai" ? "cabe" : selectedPrediction] || currentPrices[selectedPrediction])
                      : formatCurrency(realCurrentPrices[selectedPrediction] || currentPrices[selectedPrediction])}
                </span>
                {(activeCategory === "commodity" || activeCategory === "food") && <span className="text-white/40 text-xs">{chartConfig.unit === "Rp/L" ? "/L" : "/kg"}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeCategory === "commodity" && (
                <select
                  value={selectedPrediction}
                  onChange={(e) => setSelectedPrediction(e.target.value)}
                  className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
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
                  className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="berasPremium">Beras Premium</option>
                  <option value="berasMedium">Beras Medium</option>
                  <option value="minyakPremium">Minyak Goreng Premium</option>
                  <option value="minyakita">Minyak MINYAKITA</option>
                  <option value="telur">Telur Ayam Ras</option>
                </select>
              )}
              {activeCategory === "weather" && (
                <select
                  value={selectedPrediction}
                  onChange={(e) => setSelectedPrediction(e.target.value)}
                  className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
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
                  className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="3">3 hari</option>
                  <option value="7">7 hari</option>
                  <option value="14">14 hari</option>
                  <option value="28">28 hari</option>
                  <option value="30">30 hari</option>
                </select>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color${selectedPrediction}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey={activeCategory === "weather" ? "label" : "month"}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                tickFormatter={(value) => (activeCategory === "weather" ? value.split(" ")[1] : value)}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                domain={yDomain}
                label={
                  activeCategory !== "weather"
                    ? {
                        value: chartConfig.unit, // ✅ DINAMIS (Rp/kg atau Rp/L)
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                        style: { fill: "rgba(255,255,255,0.4)", fontSize: 12 },
                      }
                    : undefined
                }
                tickFormatter={(value) => {
                  if (activeCategory === "weather") return value;
                  return value.toLocaleString("id-ID");
                }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#ffffff" }}
                formatter={(value, name) => {
                  const prefix = activeCategory === "weather" ? "Prediksi Nilai" : "Prediksi Harga";
                  return [activeCategory === "weather" ? `${value}${chartConfig.unit}` : formatCurrency(value), prefix];
                }}
                labelFormatter={(label) => (activeCategory === "weather" ? `Waktu: ${label}` : `Tanggal: ${label}`)}
              />
              <Legend verticalAlign="bottom" height={36} formatter={() => (activeCategory === "weather" ? "Prediksi Nilai" : "Prediksi Harga")} />
              <Area type="monotone" dataKey={chartConfig.predicted} stroke={chartConfig.color} strokeWidth={2} fill={`url(#color${selectedPrediction})`} fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
