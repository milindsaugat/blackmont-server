const Inquiry = require("../../models/inquiry.model");
const Client = require("../../models/client.model");

const MANAGED_PAGES_COUNT = 15;

const formatInquiry = (inquiry) => ({
  _id: inquiry._id,
  id: inquiry._id,
  name: inquiry.name || "",
  email: inquiry.email || "",
  phone: inquiry.phone || "",
  company: inquiry.company || "",
  subject: inquiry.subject || "",
  message: inquiry.message || "",
  status: inquiry.status || "unread",
  createdAt: inquiry.createdAt,
  updatedAt: inquiry.updatedAt,
});

const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalInquiries,
      unreadMessages,
      activeClients,
      recentInquiries,
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "unread" }),
      Client.countDocuments({ status: "active" }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalInquiries,
        unreadMessages,
        activeClients,
        managedPages: MANAGED_PAGES_COUNT,
        recentInquiries: recentInquiries.map(formatInquiry),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardOverview,
};