import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Backend API base URL
const BACKEND_API_URL = 'http://localhost:8000';

// Commodity configuration
const COMMODITIES = {
    jagung: { key: 'jagung', name: 'Jagung Pipilan Kering', icon: '🌽', unit: 'Rp/kg' },
    cabe: { key: 'cabe', name: 'Cabe Rawit Merah', icon: '🌶️', unit: 'Rp/kg' },
    kedelai: { key: 'kedelai', name: 'Kedelai Lokal', icon: '🫘', unit: 'Rp/kg' },
    // Food Commodities
    berasPremium: { key: 'beras-premium', name: 'Beras Premium', icon: '🍚', unit: 'Rp/kg' },
    berasMedium: { key: 'beras-medium', name: 'Beras Medium', icon: '🍚', unit: 'Rp/kg' },
    minyakPremium: { key: 'minyak-premium', name: 'Minyak Goreng Premium', icon: '🛢️', unit: 'Rp/L' },
    minyakita: { key: 'minyakita', name: 'Minyakita', icon: '🛢️', unit: 'Rp/L' },
    telur: { key: 'telur', name: 'Telur Ayam Ras', icon: '🥚', unit: 'Rp/kg' }
};

export default function useCommodityForecast() {
    const [commodityData, setCommodityData] = useState({
        jagung: null,
        cabe: null,
        kedelai: null,
        berasPremium: null,
        berasMedium: null,
        minyakPremium: null,
        minyakita: null,
        telur: null
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPrices, setCurrentPrices] = useState({
        jagung: null,
        cabe: null,
        kedelai: null,
        berasPremium: null,
        berasMedium: null,
        minyakPremium: null,
        minyakita: null,
        telur: null
    });

    // Fetch prediction for a specific commodity
    const fetchCommodityPrediction = useCallback(async (commodityKey, days = 30) => {
        // Don't set global loading here to avoid UI flickering, or manage finer grain?
        // Let's set it, but keep in mind it's global.
        // setLoading(true); 

        try {
            const response = await axios.post(
                `${BACKEND_API_URL}/market-insight/predict/${commodityKey}`,
                { days: days }
            );

            if (response.data) {
                // Process forecast data
                const forecast = response.data.forecast.map(item => ({
                    date: item.date,
                    price: item.price,
                    // Add confidence interval (±10% for visualization)
                    priceLower: Math.round(item.price * 0.9),
                    priceUpper: Math.round(item.price * 1.1)
                }));

                // Get current price (last historical or first forecast)
                const currentPrice = forecast.length > 0 ? forecast[0].price : null;

                const result = {
                    commodity: response.data.commodity,
                    forecast: forecast,
                    currentPrice: currentPrice
                };

                // Map API key to State key
                const stateKeyMap = {
                    'jagung': 'jagung',
                    'cabe': 'cabe',
                    'kedelai': 'kedelai',
                    'beras-premium': 'berasPremium',
                    'beras-medium': 'berasMedium',
                    'minyak-premium': 'minyakPremium',
                    'minyakita': 'minyakita',
                    'telur': 'telur'
                };
                const stateKey = stateKeyMap[commodityKey] || commodityKey;

                // Update State
                setCommodityData(prev => ({
                    ...prev,
                    [stateKey]: result
                }));

                setCurrentPrices(prev => ({
                    ...prev,
                    [stateKey]: currentPrice
                }));

                return result;
            }
        } catch (err) {
            console.error(`Error fetching ${commodityKey} prediction:`, err);
            // Return null instead of throwing to allow partial success
            return null;
        } finally {
            // setLoading(false);
        }
    }, []);

    // Fetch all commodities on mount
    const fetchAllCommodities = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch all commodities in parallel
            const [
                jagungData, cabeData, kedelaiData,
                berasPremiumData, berasMediumData,
                minyakPremiumData, minyakitaData, telurData
            ] = await Promise.all([
                fetchCommodityPrediction('jagung', 30),
                fetchCommodityPrediction('cabe', 30),
                fetchCommodityPrediction('kedelai', 30),
                fetchCommodityPrediction('beras-premium', 30),
                fetchCommodityPrediction('beras-medium', 30),
                fetchCommodityPrediction('minyak-premium', 30),
                fetchCommodityPrediction('minyakita', 30),
                fetchCommodityPrediction('telur', 30)
            ]);

            setCommodityData({
                jagung: jagungData,
                cabe: cabeData,
                kedelai: kedelaiData,
                berasPremium: berasPremiumData,
                berasMedium: berasMediumData,
                minyakPremium: minyakPremiumData,
                minyakita: minyakitaData,
                telur: telurData
            });

            setCurrentPrices({
                jagung: jagungData?.currentPrice,
                cabe: cabeData?.currentPrice,
                kedelai: kedelaiData?.currentPrice,
                berasPremium: berasPremiumData?.currentPrice,
                berasMedium: berasMediumData?.currentPrice,
                minyakPremium: minyakPremiumData?.currentPrice,
                minyakita: minyakitaData?.currentPrice,
                telur: telurData?.currentPrice
            });

        } catch (err) {
            console.error('Error fetching commodity predictions:', err);
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchCommodityPrediction]);

    // Initialize on mount
    useEffect(() => {
        fetchAllCommodities();
    }, []);

    // Helper: Get forecast data formatted for charts
    const getChartData = useCallback((commodityKey) => {
        const data = commodityData[commodityKey];
        if (!data || !data.forecast) return [];

        // Return daily data with date labels (no monthly grouping)
        return data.forecast.map(item => {
            const date = new Date(item.date);
            // Format: DD/MM (e.g., "09/02")
            const dateLabel = date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit'
            });

            return {
                month: dateLabel,  // Use 'month' key for compatibility with chart config
                predicted: item.price,
                lower: item.priceLower,
                upper: item.priceUpper
            };
        });
    }, [commodityData]);

    // Helper: Get daily forecast data
    const getDailyForecast = useCallback((commodityKey) => {
        const data = commodityData[commodityKey];
        if (!data || !data.forecast) return [];

        return data.forecast.map(item => ({
            date: item.date,
            price: item.price,
            priceLower: item.priceLower,
            priceUpper: item.priceUpper
        }));
    }, [commodityData]);

    // Helper: Get price statistics
    const getPriceStats = useCallback((commodityKey) => {
        const data = commodityData[commodityKey];
        if (!data || !data.forecast) return null;

        const prices = data.forecast.map(item => item.price);

        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            trend: prices[prices.length - 1] > prices[0] ? 'up' : 'down',
            change: ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(1)
        };
    }, [commodityData]);

    return {
        // Data
        commodityData,
        currentPrices,

        // State
        loading,
        error,

        // Functions
        fetchCommodityPrediction,
        fetchAllCommodities,

        // Helpers
        getChartData,
        getDailyForecast,
        getPriceStats,

        // Config
        COMMODITIES
    };
}
