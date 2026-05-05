const mongoose = require("mongoose");

const pillarSchema = new mongoose.Schema({
  number: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const corporateGovernanceSchema = new mongoose.Schema(
  {
    // Header & Core Principle
    eyebrow: { type: String, default: "CORPORATE GOVERNANCE" },
    mainTitle: { type: String, default: "Institutional Stewardship & Oversight" },
    headerDescription: { type: String, default: "A formal structure defining our commitment to transparency, structured risk management, and long-term capital preservation." },
    corePrincipleStatement: { type: String, default: "“Our governance framework is rooted in absolute alignment with long-term capital preservation, ensuring all strategic actions reflect the core mandate of our custody model.”" },
    
    // Governance Pillars
    pillars: [pillarSchema],

    // Feature Strip
    stripTitle: { type: String, default: "OVERSIGHT STANDARDS" },
    bullets: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
      default: ["Independent Audit", "Asset Verification", "Custody Compliance"]
    },
    stripFooterText: { type: String, default: "Aligned with international institutional requirements." },

    // Protection Section
    sectionTitle: { type: String, default: "Asset Protection & Ring-Fencing" },
    paragraph1: { type: String, default: "Blackmont employs a legally isolated trust architecture, ensuring that client physical holdings are entirely ring-fenced from operational capital and broader institutional liabilities." },
    paragraph2: { type: String, default: "Regular third-party physical audits verify exact custody counts, ensuring total correlation between recorded allocations and secure vault holdings." }
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 4;
}

module.exports = mongoose.model("CorporateGovernance", corporateGovernanceSchema);
