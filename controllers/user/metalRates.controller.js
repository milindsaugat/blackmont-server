const ApiSettings = require("../../models/apiSettings.model");

const METAL_PRICE_API_BASE_URL = "https://api.metalpriceapi.com/v1/latest";
const METAL_CURRENCIES = ["XAU", "XAG", "XPT"];
const METAL_RESPONSE_CONFIG = [
  { rateKey: "XAU", symbol: "Au", name: "Gold" },
  { rateKey: "XAG", symbol: "Ag", name: "Silver" },
  { rateKey: "XPT", symbol: "Pt", name: "Platinum" },
];

const buildMetalPriceApiUrl = (apiKey) => {
  return `${METAL_PRICE_API_BASE_URL}?api_key=${encodeURIComponent(apiKey)}&base=USD&currencies=${METAL_CURRENCIES.join(",")}`;
};

const toUsdPerUnit = (rate) => {
  const numericRate = Number(rate);
  if (!Number.isFinite(numericRate) || numericRate <= 0) return null;
  return Number((1 / numericRate).toFixed(2));
};

const normalizeMetalRates = (apiData) => {
  const rates = apiData?.rates || {};

  return METAL_RESPONSE_CONFIG.map((metal) => ({
    symbol: metal.symbol,
    name: metal.name,
    price: toUsdPerUnit(rates[metal.rateKey]),
  }));
};

const getMetalRates = async (req, res) => {
  try {
    const settings = await ApiSettings.findOne({ type: "metalRates" });

    if (!settings || !settings.isActive || !settings.apiKey) {
      return res.status(200).json({
        success: true,
        active: false,
        message: "Metal rates API is not configured",
        data: [],
      });
    }

    const response = await fetch(buildMetalPriceApiUrl(settings.apiKey), {
      headers: {
        Accept: "application/json",
      },
    });
    const apiData = await response.json();
    console.log("MetalPriceAPI raw response:", apiData);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Third-party API failed",
        error: apiData,
      });
    }

    res.status(200).json({
      success: true,
      active: true,
      message: "Live rates fetched successfully",
      data: normalizeMetalRates(apiData),
      raw: apiData,
      timestamp: apiData.timestamp || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch live rates",
      error: error.message,
    });
  }
};

module.exports = {
  getMetalRates,
};
