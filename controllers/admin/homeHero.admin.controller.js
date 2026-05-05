const HomeHero = require("../../models/homeHero.model");

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const parseBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
};

const getOrCreateHomeHero = async () => {
  let data = await HomeHero.findOne();

  if (!data) {
    data = await HomeHero.create(HomeHero.defaultData());
  }

  return data;
};

const getAdminHomeHero = async (req, res) => {
  try {
    const data = await getOrCreateHomeHero();

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

const upsertHomeHero = async (req, res) => {
  try {
    const existing = await HomeHero.findOne();
    const body = req.body || {};
    const updateData = {};

    [
      "eyebrow",
      "heading",
      "description",
      "primaryButtonText",
      "primaryButtonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
    ].forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = cleanString(body[field]);
      }
    });

    if (body.isActive !== undefined) {
      updateData.isActive = parseBoolean(body.isActive, existing?.isActive ?? true);
    }

    const data = await HomeHero.findOneAndUpdate(
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
      message: "Home hero updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update home hero",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminHomeHero,
  upsertHomeHero,
};
