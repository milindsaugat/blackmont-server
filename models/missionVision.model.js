const mongoose = require("mongoose");

const DEFAULT_MISSION = {
  badgeLabel: "MISSION",
  title: "Mission",
  description:
    "To safeguard and grow client wealth through a disciplined, physically-backed gold framework built on trust, accountability, and long-term value preservation.",
};

const DEFAULT_VISION = {
  badgeLabel: "VISION",
  title: "Vision",
  description:
    "To be a trusted steward of precious metal wealth, setting the standard for transparency, security, and integrity in gold ownership and asset management across generations.",
};

const DEFAULT_COMMITMENT_BOX = {
  title: "Blackmont Capital is committed to:",
  items: [
    "Ensuring secure custody and verifiable ownership of physical gold assets",
    "Upholding institutional-grade governance, compliance, and transparency in every transaction",
    "Providing stable, risk-conscious strategies that prioritise capital preservation over speculation",
    "Building enduring client relationships grounded in confidence, discretion, and reliability",
  ],
  footerParagraph:
    "Through a principled approach and unwavering focus on asset protection, Blackmont Capital serves as a reliable partner in preserving wealth across market cycles and generations.",
};

const statementSchema = new mongoose.Schema(
  {
    badgeLabel: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const commitmentBoxSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [String],
      default: [],
    },
    footerParagraph: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const missionVisionSchema = new mongoose.Schema(
  {
    mission: {
      type: statementSchema,
      default: () => ({ ...DEFAULT_MISSION }),
    },
    vision: {
      type: statementSchema,
      default: () => ({ ...DEFAULT_VISION }),
    },
    commitmentBox: {
      type: commitmentBoxSchema,
      default: () => ({
        ...DEFAULT_COMMITMENT_BOX,
        items: [...DEFAULT_COMMITMENT_BOX.items],
      }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MissionVision", missionVisionSchema);
