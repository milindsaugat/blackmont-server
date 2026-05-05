const mongoose = require("mongoose");

const dashboardSettingsSchema = new mongoose.Schema(
  {
    showClientLogin: { type: Boolean, default: true },
    showContactButton: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DashboardSettings", dashboardSettingsSchema);
