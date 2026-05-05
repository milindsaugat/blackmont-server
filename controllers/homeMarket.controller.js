const HomeMarket = require("../models/homeMarket.model");

const isYearLike = (value) => /^\d{4}$/.test(String(value || "").trim());

const normalizeChartData = (chartData = []) => {
  const normalized = chartData
    .map((point, index, points) => {
      const year = String(point.year || point.label || "").trim();
      const value = Number(point.value);

      if (!isYearLike(year) || !Number.isFinite(value)) {
        return null;
      }

      const previousValue = index > 0 ? Number(points[index - 1]?.value) : null;
      const computedGrowth =
        previousValue && Number.isFinite(previousValue)
          ? ((value - previousValue) / previousValue) * 100
          : null;
      const growthPercent =
        point.growthPercent !== undefined && point.growthPercent !== null
          ? Number(point.growthPercent)
          : computedGrowth;
      const previousYearChange =
        point.previousYearChange !== undefined && point.previousYearChange !== null
          ? Number(point.previousYearChange)
          : growthPercent;

      return {
        year,
        value,
        label: point.label && !isYearLike(point.label) ? point.label : "Year High USD",
        seriesLabel: point.seriesLabel || undefined,
        growthPercent: Number.isFinite(growthPercent) ? growthPercent : undefined,
        previousYearChange: Number.isFinite(previousYearChange)
          ? previousYearChange
          : undefined,
        unit: point.unit || "USD",
        currency: point.currency || "USD",
      };
    })
    .filter(Boolean);

  return normalized.length === chartData.length && normalized.length
    ? normalized
    : HomeMarket.defaultYearlyChartData();
};

const ensureYearlyChartData = async (data) => {
  if (!data) return data;

  const normalized = normalizeChartData(data.chartData || []);
  const current = JSON.stringify((data.chartData || []).map((point) => ({
    year: point.year,
    label: point.label,
    seriesLabel: point.seriesLabel,
    value: point.value,
    growthPercent: point.growthPercent,
    previousYearChange: point.previousYearChange,
    unit: point.unit,
    currency: point.currency,
  })));
  const next = JSON.stringify(normalized);

  if (current !== next) {
    data.chartData = normalized;
    await data.save();
  }

  return data;
};

const getPublicHomeMarket = async (req, res) => {
  try {
    let data = await HomeMarket.findOne({ isActive: true });

    if (!data) {
      const existingData = await HomeMarket.findOne();

      if (existingData) {
        return res.status(404).json({
          success: false,
          message: "Home market section not found",
          data: null,
        });
      }

      data = await HomeMarket.create({});
    }

    data = await ensureYearlyChartData(data);

    res.status(200).json({
      success: true,
      message: "Home market section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home market section",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicHomeMarket,
};
