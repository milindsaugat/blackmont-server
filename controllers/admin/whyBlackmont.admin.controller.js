const WhyBlackmont = require("../../models/whyBlackmont.model");
const mongoose = require("mongoose");

const DEFAULT_WHY_BLACKMONT = {
  eyebrowLabel: "THE BLACKMONT STANDARD",
  mainHeading: "Uncompromising Institutional Integrity",
  subHeading:
    "Built on trust, governance, and disciplined execution for long-term capital partners.",
  featureColumns: [
    {
      number: "01",
      title: "Absolute Ownership Clarity",
      description:
        "Direct ownership models with verifiable audit trails, zero-compromise documentation, and unencumbered title.",
      order: 1,
    },
    {
      number: "02",
      title: "Governance & Stewardship",
      description:
        "Rigorous internal controls, periodic external audits by global top-tier firms, and dedicated compliance frameworks.",
      order: 2,
    },
    {
      number: "03",
      title: "Institutional Professionalism",
      description:
        "A team drawn from global banking, logistics, and legal sectors delivering seamless execution and absolute discretion.",
      order: 3,
    },
  ],
  isActive: true,
};

const getFeatureList = (doc) => {
  if (doc?.featureColumns?.length) return doc.featureColumns;
  if (doc?.features?.length) return doc.features;
  return [];
};

const sortFeatureColumns = (doc) => {
  if (doc?.featureColumns) {
    doc.featureColumns.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  if (doc?.features) {
    doc.features.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  return doc;
};

const getOrCreateWhyBlackmont = async () => {
  let data = await WhyBlackmont.findOne();

  if (!data) {
    data = await WhyBlackmont.create(DEFAULT_WHY_BLACKMONT);
  }

  return sortFeatureColumns(data);
};

const getWhyBlackmontAdmin = async (req, res) => {
  try {
    const data = await getOrCreateWhyBlackmont();

    res.status(200).json({
      success: true,
      message: "Why Blackmont section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Why Blackmont section",
      error: error.message,
    });
  }
};

const upsertWhyBlackmont = async (req, res) => {
  try {
    const { eyebrowLabel, mainHeading, subHeading, featureColumns, features, isActive } =
      req.body;

    const data = await getOrCreateWhyBlackmont();

    if (eyebrowLabel !== undefined) data.eyebrowLabel = eyebrowLabel;
    if (mainHeading !== undefined) data.mainHeading = mainHeading;
    if (subHeading !== undefined) data.subHeading = subHeading;
    if (featureColumns !== undefined || features !== undefined) {
      const nextFeatures = featureColumns !== undefined ? featureColumns : features;
      data.featureColumns = nextFeatures;
      data.features = nextFeatures;
    }
    if (isActive !== undefined) data.isActive = isActive;

    await data.save();
    sortFeatureColumns(data);

    res.status(200).json({
      success: true,
      message: "Why Blackmont section updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Why Blackmont section",
      error: error.message,
    });
  }
};

const addFeatureColumn = async (req, res) => {
  try {
    const { number, title, description, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const data = await getOrCreateWhyBlackmont();

    const nextFeature = {
      number: number || "",
      title,
      description,
      order:
        order !== undefined
          ? order
          : getFeatureList(data).length + 1,
    };

    data.featureColumns.push(nextFeature);
    data.features.push(nextFeature);

    await data.save();
    sortFeatureColumns(data);

    res.status(201).json({
      success: true,
      message: "Feature column added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add feature column",
      error: error.message,
    });
  }
};

const updateFeatureColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { number, title, description, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(404).json({
        success: false,
        message: "Feature column not found",
      });
    }

    const data = await getOrCreateWhyBlackmont();
    const column = data.featureColumns.id(columnId);

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Feature column not found",
      });
    }

    if (number !== undefined) column.number = number;
    if (title !== undefined) column.title = title;
    if (description !== undefined) column.description = description;
    if (order !== undefined) column.order = order;

    await data.save();
    sortFeatureColumns(data);

    res.status(200).json({
      success: true,
      message: "Feature column updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update feature column",
      error: error.message,
    });
  }
};

const deleteFeatureColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(404).json({
        success: false,
        message: "Feature column not found",
      });
    }

    const data = await getOrCreateWhyBlackmont();
    const column = data.featureColumns.id(columnId);

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Feature column not found",
      });
    }

    column.deleteOne();
    await data.save();
    sortFeatureColumns(data);

    res.status(200).json({
      success: true,
      message: "Feature column deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feature column",
      error: error.message,
    });
  }
};

module.exports = {
  getWhyBlackmontAdmin,
  upsertWhyBlackmont,
  addFeatureColumn,
  updateFeatureColumn,
  deleteFeatureColumn,
};
