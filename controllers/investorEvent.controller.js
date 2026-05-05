const InvestorEvent = require("../models/investorEvent.model");

const getInvestorEvents = async (req, res) => {
  try {
    const events = await InvestorEvent.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, message: "Events fetched successfully", data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch events", error: error.message });
  }
};

const getSingleInvestorEvent = async (req, res) => {
  try {
    const event = await InvestorEvent.findOne({ _id: req.params.id, isPublished: true });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event fetched successfully", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch event", error: error.message });
  }
};

module.exports = {
  getInvestorEvents,
  getSingleInvestorEvent
};
