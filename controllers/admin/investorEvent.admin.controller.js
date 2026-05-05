const InvestorEvent = require("../../models/investorEvent.model");
const fs = require("fs");
const path = require("path");

const DEFAULT_EVENTS = [
  {
    categoryTag: "INVESTOR EVENT",
    eventTitle: "Global Bullion Outlook 2026",
    date: "MARCH 2026",
    buttonLabel: "View Presentation",
    description: "A forward-looking discussion on the evolving role of physical bullion within preservation-led capital strategies.",
    fileSource: "externalUrl",
    externalUrl: "https://example.com/global-bullion-outlook-2026.pdf",
    status: "outlined",
    isPublished: true,
    order: 1
  },
  {
    categoryTag: "INVESTOR EVENT",
    eventTitle: "Institutional Gold Strategy Briefing",
    date: "JUNE 2026",
    buttonLabel: "View Presentation",
    description: "A focused presentation on governance, custody structures, and long-horizon physical gold positioning.",
    fileSource: "externalUrl",
    externalUrl: "https://example.com/institutional-gold-strategy-briefing.pdf",
    status: "outlined",
    isPublished: true,
    order: 2
  },
  {
    categoryTag: "INVESTOR EVENT",
    eventTitle: "Annual Investor Dialogue",
    date: "SEPTEMBER 2026",
    buttonLabel: "View Presentation",
    description: "An annual engagement session designed to review stewardship priorities, operating themes, and strategic outlook.",
    fileSource: "externalUrl",
    externalUrl: "https://example.com/annual-investor-dialogue.pdf",
    status: "outlined",
    isPublished: true,
    order: 3
  }
];

const deleteFile = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filename = fileUrl.split("/uploads/investor-events/")[1];
    if (filename) {
      const filePath = path.join(__dirname, "../../uploads/investor-events", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

const getInvestorEventsAdmin = async (req, res) => {
  try {
    const count = await InvestorEvent.countDocuments();
    if (count === 0) {
      await InvestorEvent.insertMany(DEFAULT_EVENTS);
    }

    const events = await InvestorEvent.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, message: "Events fetched successfully", data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch events", error: error.message });
  }
};

const getSingleInvestorEventAdmin = async (req, res) => {
  try {
    const event = await InvestorEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event fetched successfully", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch event", error: error.message });
  }
};

const createInvestorEvent = async (req, res) => {
  try {
    const {
      categoryTag,
      eventTitle,
      date,
      buttonLabel,
      description,
      fileSource,
      externalUrl,
      status,
      isPublished,
      order
    } = req.body;

    let uploadedFileUrl = "";
    let fileName = "";
    let fileSize = "";

    if (fileSource === "uploadFile" && req.file) {
      uploadedFileUrl = `${req.protocol}://${req.get("host")}/uploads/investor-events/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;
    }

    const newEvent = new InvestorEvent({
      categoryTag,
      eventTitle,
      date,
      buttonLabel,
      description,
      fileSource,
      uploadedFileUrl,
      fileName,
      fileSize,
      externalUrl: fileSource === "externalUrl" ? externalUrl : "",
      status,
      isPublished: isPublished === "false" || isPublished === false ? false : true,
      order: parseInt(order, 10) || 0
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: "Event created successfully", data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create event", error: error.message });
  }
};

const updateInvestorEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await InvestorEvent.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const updates = { ...req.body };

    if (updates.isPublished !== undefined) {
      updates.isPublished = updates.isPublished === "false" || updates.isPublished === false ? false : true;
    }
    if (updates.order !== undefined) {
      updates.order = parseInt(updates.order, 10) || 0;
    }

    if (updates.fileSource === "uploadFile") {
      if (req.file) {
        if (event.uploadedFileUrl) {
          deleteFile(event.uploadedFileUrl);
        }
        updates.uploadedFileUrl = `${req.protocol}://${req.get("host")}/uploads/investor-events/${req.file.filename}`;
        updates.fileName = req.file.originalname;
        updates.fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;
      } else if (req.body.removeFile === "true") {
        if (event.uploadedFileUrl) {
          deleteFile(event.uploadedFileUrl);
        }
        updates.uploadedFileUrl = "";
        updates.fileName = "";
        updates.fileSize = "";
      }
      updates.externalUrl = "";
    } else if (updates.fileSource === "externalUrl") {
      if (event.uploadedFileUrl) {
        deleteFile(event.uploadedFileUrl);
      }
      updates.uploadedFileUrl = "";
      updates.fileName = "";
      updates.fileSize = "";
    }

    const updatedEvent = await InvestorEvent.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update event", error: error.message });
  }
};

const deleteInvestorEvent = async (req, res) => {
  try {
    const event = await InvestorEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.uploadedFileUrl) {
      deleteFile(event.uploadedFileUrl);
    }

    await InvestorEvent.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Event deleted successfully", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete event", error: error.message });
  }
};

const toggleInvestorEventPublished = async (req, res) => {
  try {
    const event = await InvestorEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    event.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : !event.isPublished;
    await event.save();

    res.status(200).json({ success: true, message: "Event publish status updated successfully", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update event status", error: error.message });
  }
};

module.exports = {
  getInvestorEventsAdmin,
  getSingleInvestorEventAdmin,
  createInvestorEvent,
  updateInvestorEvent,
  deleteInvestorEvent,
  toggleInvestorEventPublished
};
