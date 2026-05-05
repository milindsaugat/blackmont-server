const HomeAbout = require("../models/homeAbout.model");

const getPublicHomeAbout = async (req, res) => {
  try {
    const data = await HomeAbout.findOne({ isActive: true });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Home about section not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Home about section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home about section",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicHomeAbout,
};