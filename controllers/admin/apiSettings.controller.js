const ApiSettings = require("../../models/apiSettings.model");

const normalizeApiKey = (value = "") => {
  const rawValue = String(value).trim();

  if (!rawValue) return "";

  try {
    const url = new URL(rawValue);
    return url.searchParams.get("api_key") || rawValue;
  } catch {
    return rawValue;
  }
};

const getApiSettings = async (req, res) => {
  try {
    let settings = await ApiSettings.findOne({ type: "metalRates" });

    if (!settings) {
      settings = await ApiSettings.create({
        type: "metalRates",
        isActive: false,
        apiKey: "",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load API settings",
      error: error.message,
    });
  }
};

const updateApiSettings = async (req, res) => {
  try {
    const { apiKey, isActive } = req.body;
    const normalizedApiKey = normalizeApiKey(apiKey);

    const settings = await ApiSettings.findOneAndUpdate(
      { type: "metalRates" },
      {
        $set: {
          type: "metalRates",
          apiKey: normalizedApiKey,
          isActive: Boolean(isActive),
        },
        $unset: {
          apiUrl: "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await ApiSettings.collection.updateOne(
      { _id: settings._id },
      { $unset: { apiUrl: "" } }
    );

    res.status(200).json({
      success: true,
      message: "API settings saved successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save API settings",
      error: error.message,
    });
  }
};

module.exports = {
  getApiSettings,
  updateApiSettings,
};
