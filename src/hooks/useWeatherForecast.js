import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// OpenWeather API for current conditions
const OPENWEATHER_API_KEY = '99fdd4cb00e534bbbba703cfd9cfa34d';

// Backend API base URL (adjust based on your setup)
const BACKEND_API_URL = 'http://localhost:8000';

export default function useWeatherForecast() {
    // OpenWeather states (current conditions)
    const [currentWeather, setCurrentWeather] = useState(null);
    const [openWeatherForecast, setOpenWeatherForecast] = useState([]);
    const [location, setLocation] = useState(null);

    // Backend ARIMAX prediction states
    const [arimaxPrediction, setArimaxPrediction] = useState(null);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [predictionError, setPredictionError] = useState(null);

    // General states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coords, setCoords] = useState(null);

    // =====================================================
    // FETCH CURRENT WEATHER FROM OPENWEATHER
    // =====================================================
    const fetchOpenWeather = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            // Fetch current weather
            const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' }
            });
            setCurrentWeather(weatherResponse.data);
            setLocation(weatherResponse.data.name);

            // Fetch 5-day forecast (3-hour intervals) from OpenWeather
            const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' }
            });

            // Process OpenWeather forecast data
            const processedForecast = forecastResponse.data.list.map(item => ({
                dt: item.dt,
                datetime: new Date(item.dt * 1000),
                date: new Date(item.dt * 1000).toLocaleDateString('id-ID'),
                time: new Date(item.dt * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                temp: Math.round(item.main.temp),
                humidity: item.main.humidity,
                feelsLike: Math.round(item.main.feels_like),
                windSpeed: item.wind.speed,
                weather: item.weather[0],
                description: item.weather[0].description,
                source: 'openweather'
            }));

            setOpenWeatherForecast(processedForecast);
        } catch (err) {
            console.error('Error fetching OpenWeather:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH PREDICTION FROM BACKEND ARIMAX API
    // =====================================================
    const fetchArimaxPrediction = useCallback(async (hours = 168) => {
        setPredictionLoading(true);
        setPredictionError(null);
        try {
            const response = await axios.post(`${BACKEND_API_URL}/predict/suhu`, {
                hours: hours,
                use_db_data: true
            });

            if (response.data.success) {
                // Get humidity info from exog_used
                const exogUsed = response.data.exog_used;
                const humidityAvg = exogUsed.kelembapan_persen;
                const humidityMin = exogUsed.kelembapan_min;
                const humidityMax = exogUsed.kelembapan_max;

                // Process ARIMAX predictions
                const predictions = response.data.predictions.map((item, index) => {
                    const hour = item.hour;

                    // Calculate humidity for this hour
                    let humidity;
                    if (humidityMin !== null && humidityMax !== null) {
                        // LSTM prediction: vary humidity
                        const ratio = index / response.data.predictions.length;
                        humidity = Math.round(humidityMin + (humidityMax - humidityMin) * Math.sin(ratio * Math.PI));
                    } else {
                        // Database average: constant
                        humidity = Math.round(humidityAvg);
                    }

                    return {
                        datetime: new Date(item.datetime),
                        date: item.date,
                        time: `${hour.toString().padStart(2, '0')}.00`,
                        temp: item.temperature,
                        humidity: humidity,
                        hour: hour,
                        source: 'arimax'
                    };
                });

                setArimaxPrediction({
                    predictions,
                    summary: response.data.summary,
                    exogUsed: response.data.exog_used,
                    dataSource: response.data.data_source,
                    startDatetime: response.data.start_datetime,
                    endDatetime: response.data.end_datetime
                });

                return response.data;
            }
        } catch (err) {
            console.error('Error fetching ARIMAX prediction:', err);
            setPredictionError(err.response?.data?.detail || err.message);
        } finally {
            setPredictionLoading(false);
        }
    }, []);

    // Quick prediction for X days
    const fetchQuickPrediction = useCallback(async (days = 7) => {
        setPredictionLoading(true);
        setPredictionError(null);
        try {
            const response = await axios.get(`${BACKEND_API_URL}/predict/suhu/quick/${days}`);

            if (response.data.success) {
                // Get humidity info from exog_used
                const exogUsed = response.data.exog_used;
                const humidityAvg = exogUsed.kelembapan_persen;
                const humidityMin = exogUsed.kelembapan_min;
                const humidityMax = exogUsed.kelembapan_max;
                const humiditySource = exogUsed.humidity_source;

                const predictions = response.data.predictions.map((item, index) => {
                    const hour = item.hour;

                    // Calculate humidity for this hour
                    // If LSTM prediction, interpolate between min and max
                    // If database average, use constant value
                    let humidity;
                    if (humidityMin !== null && humidityMax !== null) {
                        // LSTM prediction: vary humidity slightly based on position
                        const ratio = index / response.data.predictions.length;
                        humidity = Math.round(humidityMin + (humidityMax - humidityMin) * Math.sin(ratio * Math.PI));
                    } else {
                        // Database average: constant
                        humidity = Math.round(humidityAvg);
                    }

                    return {
                        datetime: new Date(item.datetime),
                        date: item.date,
                        time: `${hour.toString().padStart(2, '0')}.00`,
                        temp: item.temperature,
                        humidity: humidity,
                        hour: hour,
                        source: 'arimax'
                    };
                });

                setArimaxPrediction({
                    predictions,
                    summary: response.data.summary,
                    exogUsed: response.data.exog_used,
                    dataSource: response.data.data_source,
                    startDatetime: response.data.start_datetime,
                    endDatetime: response.data.end_datetime
                });

                return response.data;
            }
        } catch (err) {
            console.error('Error fetching quick prediction:', err);
            setPredictionError(err.response?.data?.detail || err.message);
        } finally {
            setPredictionLoading(false);
        }
    }, []);

    // Fetch latest weather from backend database
    const fetchLatestCuaca = useCallback(async () => {
        try {
            const response = await axios.get(`${BACKEND_API_URL}/predict/cuaca/latest`);
            return response.data.data;
        } catch (err) {
            console.error('Error fetching latest cuaca:', err);
            return null;
        }
    }, []);

    // =====================================================
    // INITIALIZE: Use fixed location for Desa Sumberarum
    // =====================================================
    useEffect(() => {
        // Fixed coordinates for Desa Sumberarum, Wates, Blitar, Jawa Timur
        // Coords: approx -8.2483, 112.3386 (from 8°14'54"S 112°20'19"E)
        const SUMBERARUM_COORDS = { lat: -8.2483, lon: 112.3386 };
        setCoords(SUMBERARUM_COORDS);
        setLocation('Desa Sumberarum, Blitar'); // Fixed location name
        fetchOpenWeather(SUMBERARUM_COORDS.lat, SUMBERARUM_COORDS.lon);

        // Also fetch ARIMAX prediction on mount (30 days default)
        fetchQuickPrediction(30);
    }, []);

    // =====================================================
    // HELPER FUNCTIONS
    // =====================================================

    // Get OpenWeather forecast for specific date and time
    const getForecastByDateTime = (date, hour) => {
        if (!openWeatherForecast.length) return null;

        const targetDate = new Date(date);
        targetDate.setHours(parseInt(hour), 0, 0, 0);

        let closest = openWeatherForecast[0];
        let minDiff = Math.abs(openWeatherForecast[0].datetime - targetDate);

        openWeatherForecast.forEach(item => {
            const diff = Math.abs(item.datetime - targetDate);
            if (diff < minDiff) {
                minDiff = diff;
                closest = item;
            }
        });

        return closest;
    };

    // Get ARIMAX prediction for specific date and time
    const getArimaxByDateTime = (date, hour) => {
        if (!arimaxPrediction?.predictions?.length) return null;

        const targetDate = new Date(date);
        targetDate.setHours(parseInt(hour), 0, 0, 0);

        let closest = arimaxPrediction.predictions[0];
        let minDiff = Math.abs(new Date(arimaxPrediction.predictions[0].datetime) - targetDate);

        arimaxPrediction.predictions.forEach(item => {
            const itemDate = new Date(item.datetime);
            const diff = Math.abs(itemDate - targetDate);
            if (diff < minDiff) {
                minDiff = diff;
                closest = item;
            }
        });

        return closest;
    };

    // Get available dates from OpenWeather forecast
    const getAvailableDates = () => {
        const dates = new Set();
        openWeatherForecast.forEach(item => {
            dates.add(item.datetime.toISOString().split('T')[0]);
        });
        return Array.from(dates);
    };

    // Get available times for a specific date (OpenWeather)
    const getAvailableTimes = (date) => {
        return openWeatherForecast
            .filter(item => item.datetime.toISOString().split('T')[0] === date)
            .map(item => ({
                value: item.datetime.getHours().toString().padStart(2, '0'),
                label: item.time,
                data: item
            }));
    };

    // Get ARIMAX prediction dates (up to 30 days)
    const getArimaxDates = () => {
        if (!arimaxPrediction?.predictions?.length) return [];

        const dates = new Set();
        arimaxPrediction.predictions.forEach(item => {
            const d = new Date(item.datetime);
            dates.add(d.toISOString().split('T')[0]);
        });
        return Array.from(dates);
    };

    // Get ARIMAX times for specific date
    const getArimaxTimes = (date) => {
        if (!arimaxPrediction?.predictions?.length) return [];

        return arimaxPrediction.predictions
            .filter(item => {
                const d = new Date(item.datetime);
                return d.toISOString().split('T')[0] === date;
            })
            .map(item => ({
                value: item.hour.toString().padStart(2, '0'),
                label: `${item.hour.toString().padStart(2, '0')}.00`,
                data: item
            }));
    };

    // Get daily summary for chart (OpenWeather)
    const getDailySummary = () => {
        const dailyMap = new Map();

        openWeatherForecast.forEach(item => {
            const dateKey = item.datetime.toISOString().split('T')[0];
            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, {
                    temps: [],
                    humidities: [],
                    date: item.datetime
                });
            }
            dailyMap.get(dateKey).temps.push(item.temp);
            dailyMap.get(dateKey).humidities.push(item.humidity);
        });

        return Array.from(dailyMap.entries()).map(([dateKey, data]) => ({
            date: dateKey,
            month: data.date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            tempMin: Math.min(...data.temps),
            tempMax: Math.max(...data.temps),
            tempAvg: Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length),
            humidityMin: Math.min(...data.humidities),
            humidityMax: Math.max(...data.humidities),
            humidityAvg: Math.round(data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length),
            source: 'openweather'
        }));
    };

    // Get ARIMAX daily summary for chart
    const getArimaxDailySummary = () => {
        if (!arimaxPrediction?.predictions?.length) return [];

        const dailyMap = new Map();

        arimaxPrediction.predictions.forEach(item => {
            const dateKey = item.date;
            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, {
                    temps: [],
                    date: new Date(item.datetime)
                });
            }
            dailyMap.get(dateKey).temps.push(item.temp);
        });

        return Array.from(dailyMap.entries()).map(([dateKey, data]) => ({
            date: dateKey,
            month: data.date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            tempMin: Math.min(...data.temps),
            tempMax: Math.max(...data.temps),
            tempAvg: Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length * 100) / 100,
            source: 'arimax'
        }));
    };

    return {
        // Current weather (OpenWeather)
        currentWeather,
        location,
        coords,

        // OpenWeather forecast (5 days)
        forecast: openWeatherForecast,
        loading,
        error,

        // ARIMAX prediction (up to 30 days)
        arimaxPrediction,
        predictionLoading,
        predictionError,

        // Fetch functions
        fetchArimaxPrediction,
        fetchQuickPrediction,
        fetchLatestCuaca,

        // OpenWeather helpers
        getForecastByDateTime,
        getAvailableDates,
        getAvailableTimes,
        getDailySummary,

        // ARIMAX helpers
        getArimaxByDateTime,
        getArimaxDates,
        getArimaxTimes,
        getArimaxDailySummary
    };
}
