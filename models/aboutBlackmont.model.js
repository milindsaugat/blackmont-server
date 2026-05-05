const mongoose = require("mongoose");

const DEFAULT_INTRO_TEXT =
  "Based in Malaysia, the Firm empowers institutional and private clients worldwide with innovative strategies for deploying their gold, transforming inert assets into dynamic instruments for wealth preservation and growth. The Firm's commitment to expertise, integrity, and client-centric solutions defines our approach.";

const DEFAULT_CONTENT_SECTIONS = [
  {
    sectionNumber: "01",
    title: "Blackmont Redefining the Role of Gold",
    paragraphs: [
      "Gold has traditionally been held as a passive store of value.",
      "Blackmont Capital advances this paradigm by enabling clients to manage and optimise their bullion holdings actively, transforming physical gold into a dynamic financial asset while preserving its fundamental role as a hedge and store of wealth.",
      "Our platform bridges the gap between traditional bullion ownership and modern financial strategy, allowing clients to engage with gold in a more transparent, structured, and efficient manner.",
    ],
    order: 1,
    published: true,
  },
  {
    sectionNumber: "02",
    title: "Institutional Approach, Built on Experience",
    paragraphs: [
      "Blackmont Capital is underpinned by leadership with decades of experience across the global bullion value chain, from mining and refining to wholesale trading and distribution.",
    ],
    order: 2,
    published: true,
  },
];

const DEFAULT_FOOTER_STATEMENT =
  "Blackmont Capital represents a new standard in precious metals ownership, where security, transparency, and strategy converge. Beyond Bullion, we deliver certainty.";

const contentSectionSchema = new mongoose.Schema(
  {
    sectionNumber: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    paragraphs: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const aboutBlackmontSchema = new mongoose.Schema(
  {
    introText: {
      type: String,
      default: DEFAULT_INTRO_TEXT,
      trim: true,
    },
    contentSections: {
      type: [contentSectionSchema],
      default: () =>
        DEFAULT_CONTENT_SECTIONS.map((section) => ({
          ...section,
          paragraphs: [...section.paragraphs],
        })),
    },
    footerStatement: {
      type: String,
      default: DEFAULT_FOOTER_STATEMENT,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutBlackmont", aboutBlackmontSchema);
