const HomeHero = require("../../models/homeHero.model");

const getPublicHomeHero = async (req, res) => {
  try {
    let data = await HomeHero.findOne();

    if (!data) {
      data = await HomeHero.create(HomeHero.defaultData());
    }

    if (data.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Active home hero not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Home hero fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home hero",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicHomeHero,
};
