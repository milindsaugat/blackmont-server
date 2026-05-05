const DashboardSettings = require("../../models/dashboardSettings.model");

const DEFAULT_DASHBOARD_SETTINGS = {
  showClientLogin: true,
  showContactButton: true,
};

const getPublicDashboardSettings = async (req, res) => {
  try {
    let settings = await DashboardSettings.findOne();

    if (!settings) {
      settings = await DashboardSettings.create(DEFAULT_DASHBOARD_SETTINGS);
    }

    res.status(200).json({
      success: true,
      message: "Dashboard settings retrieved successfully",
      data: {
        showClientLogin: settings.showClientLogin ?? true,
        showContactButton: settings.showContactButton ?? true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard settings",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicDashboardSettings,
};
