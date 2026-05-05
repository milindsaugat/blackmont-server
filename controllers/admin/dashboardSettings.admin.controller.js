const DashboardSettings = require("../../models/dashboardSettings.model");

const DEFAULT_DASHBOARD_SETTINGS = {
  showClientLogin: true,
  showContactButton: true,
};

const getOrCreateDashboardSettings = async () => {
  let settings = await DashboardSettings.findOne();

  if (!settings) {
    settings = await DashboardSettings.create(DEFAULT_DASHBOARD_SETTINGS);
  }

  if (settings.showClientLogin === undefined) {
    settings.showClientLogin = true;
  }

  if (settings.showContactButton === undefined) {
    settings.showContactButton = true;
  }

  await settings.save();
  return settings;
};

const getDashboardSettings = async (req, res) => {
  try {
    const settings = await getOrCreateDashboardSettings();

    res.status(200).json({
      success: true,
      message: "Dashboard settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard settings",
      error: error.message,
    });
  }
};

const updateDashboardSettings = async (req, res) => {
  try {
    const payload = {};

    if (typeof req.body.showClientLogin === "boolean") {
      payload.showClientLogin = req.body.showClientLogin;
    }

    if (typeof req.body.showContactButton === "boolean") {
      payload.showContactButton = req.body.showContactButton;
    }

    const settings = await DashboardSettings.findOneAndUpdate(
      {},
      { $set: payload },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Dashboard settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update dashboard settings",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSettings,
  updateDashboardSettings,
};
