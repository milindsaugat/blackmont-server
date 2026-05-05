const Leadership = require("../models/leadership.model");

const getOrCreateLeadership = async () => {
  let leadership = await Leadership.findOne();

  if (!leadership) {
    leadership = await Leadership.create({});
  }

  return leadership;
};

const getPublicLeadership = async (req, res) => {
  try {
    const leadership = await getOrCreateLeadership();

    res.status(200).json({
      success: true,
      data: leadership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Leadership",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicLeadership,
};
