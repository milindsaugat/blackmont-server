const mongoose = require("mongoose");

const apiSettingsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "metalRates",
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    apiKey: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApiSettings", apiSettingsSchema);
