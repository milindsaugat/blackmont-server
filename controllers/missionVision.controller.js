const MissionVision = require("../models/missionVision.model");

const getOrCreateMissionVision = async () => {
  let missionVision = await MissionVision.findOne();

  if (!missionVision) {
    missionVision = await MissionVision.create({});
  }

  return missionVision;
};

const getPublicMissionVision = async (req, res) => {
  try {
    const missionVision = await getOrCreateMissionVision();
    const data = missionVision.toObject();

    res.status(200).json({
      success: true,
      message: "Mission & Vision fetched successfully",
      data: {
        mission: data.mission,
        vision: data.vision,
        commitmentBox: data.commitmentBox,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Mission & Vision",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicMissionVision,
};
