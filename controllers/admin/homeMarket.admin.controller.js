const HomeMarket = require("../../models/homeMarket.model");

const getDefaultYearlyChartData = () => HomeMarket.defaultYearlyChartData();

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
    : getDefaultYearlyChartData();
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

const DEFAULT_HOME_MARKET = {
  eyebrowLabel: "INSIGHTS & MARKET PERSPECTIVE",
  mainHeading: "Navigating Macroeconomic Shifts with Precious Metals",
  description:
    "Access our exclusive quarterly analysis on global gold flows, central bank accumulation, and the evolving role of hard assets in institutional portfolios.",
  tags: [
    "MACROECONOMIC SHIFTS",
    "CENTRAL BANK RESERVE BEHAVIOR",
    "CUSTODY MIGRATION DYNAMICS",
  ],
  chartTitle: "Year High USD",
  chartSubtitle:
    "Net purchases showing unprecedented sustained accumulation across major economies.",
  chartBadge: "MARKET INSIGHT",
  chartData: getDefaultYearlyChartData(),
  isActive: true,
};

const getOrCreateHomeMarket = async () => {
  let data = await HomeMarket.findOne();

  if (!data) {
    data = await HomeMarket.create(DEFAULT_HOME_MARKET);
  }

  return ensureYearlyChartData(data);
};

const getAdminHomeMarket = async (req, res) => {
  try {
    const data = await getOrCreateHomeMarket();

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

const updateHomeMarket = async (req, res) => {
  try {
    const {
      eyebrowLabel,
      title,
      mainHeading,
      subtitle,
      description,
      tags,
      chartTitle,
      chartSubtitle,
      chartBadge,
      chartData,
      isActive,
    } = req.body;

    const updateData = {};

    if (eyebrowLabel !== undefined) updateData.eyebrowLabel = eyebrowLabel;
    if (mainHeading !== undefined) updateData.mainHeading = mainHeading;
    else if (title !== undefined) updateData.mainHeading = title;
    if (description !== undefined) updateData.description = description;
    else if (subtitle !== undefined) updateData.description = subtitle;
    if (tags !== undefined) updateData.tags = tags;
    if (chartTitle !== undefined) updateData.chartTitle = chartTitle;
    if (chartSubtitle !== undefined) updateData.chartSubtitle = chartSubtitle;
    if (chartBadge !== undefined) updateData.chartBadge = chartBadge;
    if (chartData !== undefined) updateData.chartData = normalizeChartData(chartData);
    if (isActive !== undefined) updateData.isActive = isActive;

    const data = await HomeMarket.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Home market section updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update home market section",
      error: error.message,
    });
  }
};

const addHomeMarketTag = async (req, res) => {
  try {
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: "Tag is required",
      });
    }

    await getOrCreateHomeMarket();

    const data = await HomeMarket.findOneAndUpdate(
      {},
      { $push: { tags: tag } },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Home market tag added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add home market tag",
      error: error.message,
    });
  }
};

const deleteHomeMarketTag = async (req, res) => {
  try {
    const { tag } = req.params;

    await getOrCreateHomeMarket();

    const data = await HomeMarket.findOneAndUpdate(
      {},
      { $pull: { tags: tag } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Home market tag deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete home market tag",
      error: error.message,
    });
  }
};

const addChartDataPoint = async (req, res) => {
  try {
    const { year, label, seriesLabel, value, growthPercent, previousYearChange, unit, currency } = req.body;
    const dataYear = year || label;

    if (!isYearLike(dataYear) || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Year and value are required",
      });
    }

    await getOrCreateHomeMarket();

    const data = await HomeMarket.findOneAndUpdate(
      {},
      {
        $push: {
          chartData: {
            year: String(dataYear).trim(),
            label: label && !isYearLike(label) ? label : "Year High USD",
            seriesLabel,
            value,
            growthPercent,
            previousYearChange,
            unit: unit || "USD",
            currency: currency || "USD",
          },
        },
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Home market chart data point added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add home market chart data point",
      error: error.message,
    });
  }
};

const deleteChartDataPoint = async (req, res) => {
  try {
    const { dataId } = req.params;

    await getOrCreateHomeMarket();

    const data = await HomeMarket.findOneAndUpdate(
      {},
      { $pull: { chartData: { _id: dataId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Home market chart data point deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete home market chart data point",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminHomeMarket,
  updateHomeMarket,
  addHomeMarketTag,
  deleteHomeMarketTag,
  addChartDataPoint,
  deleteChartDataPoint,
};
