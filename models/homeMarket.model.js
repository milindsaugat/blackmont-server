const mongoose = require("mongoose");

const DEFAULT_YEARLY_CHART_DATA = [
  { year: "2016", value: 1380, label: "Year High USD" },
  { year: "2017", value: 1375, label: "Year High USD" },
  { year: "2018", value: 1378, label: "Year High USD" },
  { year: "2019", value: 1557, label: "Year High USD" },
  { year: "2020", value: 2067, label: "Year High USD" },
  { year: "2021", value: 2049, label: "Year High USD" },
  { year: "2022", value: 2070, label: "Year High USD" },
  { year: "2023", value: 2135, label: "Year High USD" },
  { year: "2024", value: 2790, label: "Year High USD" },
  { year: "2025", value: 4550, label: "Year High USD" },
  { year: "2026", value: 5600, label: "Year High USD" },
];

const chartDataSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    seriesLabel: {
      type: String,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    growthPercent: {
      type: Number,
    },
    previousYearChange: {
      type: Number,
    },
    unit: {
      type: String,
      trim: true,
      default: "USD",
    },
    currency: {
      type: String,
      trim: true,
      default: "USD",
    },
  },
  { _id: true }
);

const homeMarketSchema = new mongoose.Schema(
  {
    eyebrowLabel: {
      type: String,
      trim: true,
      default: "INSIGHTS & MARKET PERSPECTIVE",
    },
    mainHeading: {
      type: String,
      trim: true,
      default: "Navigating Macroeconomic Shifts with Precious Metals",
    },
    description: {
      type: String,
      trim: true,
      default:
        "Access our exclusive quarterly analysis on global gold flows, central bank accumulation, and the evolving role of hard assets in institutional portfolios.",
    },
    tags: {
      type: [String],
      default: [
        "MACROECONOMIC SHIFTS",
        "CENTRAL BANK RESERVE BEHAVIOR",
        "CUSTODY MIGRATION DYNAMICS",
      ],
    },
    chartTitle: {
      type: String,
      trim: true,
      default: "Year High USD",
    },
    chartSubtitle: {
      type: String,
      trim: true,
      default:
        "Net purchases showing unprecedented sustained accumulation across major economies.",
    },
    chartBadge: {
      type: String,
      trim: true,
      default: "MARKET INSIGHT",
    },
    chartData: {
      type: [chartDataSchema],
      default: () => DEFAULT_YEARLY_CHART_DATA.map((point) => ({ ...point })),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

homeMarketSchema.statics.defaultYearlyChartData = function () {
  return DEFAULT_YEARLY_CHART_DATA.map((point) => ({ ...point }));
};

module.exports = mongoose.model("HomeMarket", homeMarketSchema);
