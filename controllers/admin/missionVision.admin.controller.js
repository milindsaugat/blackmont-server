const MissionVision = require("../../models/missionVision.model");

const getOrCreateMissionVision = async () => {
  let missionVision = await MissionVision.findOne();

  if (!missionVision) {
    missionVision = await MissionVision.create({});
  }

  return missionVision;
};

const normalizeStatement = (statement) => {
  if (!statement || typeof statement !== "object") return undefined;

  return {
    badgeLabel: statement.badgeLabel || "",
    title: statement.title || "",
    description: statement.description || "",
  };
};

const normalizeCommitmentBox = (commitmentBox) => {
  if (!commitmentBox || typeof commitmentBox !== "object") return undefined;

  return {
    title: commitmentBox.title || "",
    items: Array.isArray(commitmentBox.items)
      ? commitmentBox.items.map((item) => String(item || ""))
      : [],
    footerParagraph: commitmentBox.footerParagraph || "",
  };
};

const getAdminMissionVision = async (req, res) => {
  try {
    const missionVision = await getOrCreateMissionVision();

    res.status(200).json({
      success: true,
      message: "Mission & Vision fetched successfully",
      data: missionVision,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Mission & Vision",
      error: error.message,
    });
  }
};

const updateMissionVision = async (req, res) => {
  try {
    const { mission, vision, commitmentBox } = req.body;
    const updateData = {};

    const normalizedMission = normalizeStatement(mission);
    const normalizedVision = normalizeStatement(vision);
    const normalizedCommitmentBox = normalizeCommitmentBox(commitmentBox);

    if (normalizedMission !== undefined) updateData.mission = normalizedMission;
    if (normalizedVision !== undefined) updateData.vision = normalizedVision;
    if (normalizedCommitmentBox !== undefined) {
      updateData.commitmentBox = normalizedCommitmentBox;
    }

    const missionVision = await MissionVision.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Mission & Vision updated successfully",
      data: missionVision,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Mission & Vision",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminMissionVision,
  updateMissionVision,
};
