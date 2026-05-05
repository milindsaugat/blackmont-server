const CorporateGovernance = require("../models/corporateGovernance.model");

const getGovernance = async (req, res) => {
  try {
    const doc = await CorporateGovernance.findOne();
    
    if (!doc) {
      return res.status(404).json({ success: false, message: "Corporate governance content not found" });
    }

    // Filter active pillars and sort by order
    const activePillars = doc.pillars
      .filter(pillar => pillar.isActive)
      .sort((a, b) => a.order - b.order);

    // Convert mongoose doc to plain object so we can overwrite the pillars array
    const responseData = doc.toObject();
    responseData.pillars = activePillars;

    res.status(200).json({ success: true, message: "Corporate governance fetched successfully", data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch corporate governance", error: error.message });
  }
};

module.exports = {
  getGovernance
};
