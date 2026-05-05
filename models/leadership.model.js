const mongoose = require("mongoose");

const DEFAULT_HERO = {
  pageTitle: "Leadership",
  heroSubtitle:
    "Blackmont Capital is led by a group of seasoned entrepreneurs and precious metals professionals with extensive experience across the global gold and bullion ecosystem.",
};

const DEFAULT_INTRO_CARD = {
  paragraph:
    "This breadth of exposure provides the firm with a holistic, ground-up understanding of the precious metals ecosystem, from source extraction and supply dynamics to market pricing, liquidity flows, and end-client distribution. As a result, the leadership team is able to navigate the complexities of the gold market with precision, insight, and discipline.",
};

const DEFAULT_EXPERTISE_SECTION = {
  heading: "The team brings together:",
  bulletPoints: [
    "Deep operational expertise across upstream and downstream segments of the bullion industry",
    "Longstanding relationships with miners, refiners, traders, vaulting providers, and institutional counterparties",
    "Proven experience managing market cycles, volatility, and liquidity conditions across different economic environments",
  ],
};

const DEFAULT_STRATEGY_SECTION = {
  operationalStrategyParagraph:
    "Having operated across multiple layers of the industry, the leadership team possesses a practical understanding of both opportunity and risk, enabling Blackmont Capital to structure strategies that prioritise asset integrity, execution reliability, and capital preservation.",
  unifiedPhilosophyLabel: "UNIFIED PHILOSOPHY",
  unifiedPhilosophyParagraph:
    "Beyond technical expertise, the group shares a unified philosophy centred on trust, accountability, and long-term value stewardship. This alignment ensures that decisions are made not only with commercial intent, but with a strong emphasis on protecting client interests and maintaining institutional standards.",
};

const DEFAULT_CONCLUDING_STATEMENT = {
  text:
    "Collectively, this leadership foundation positions Blackmont Capital as a platform built on credibility, experience, and execution capability, capable of delivering consistent performance while maintaining the highest levels of governance.",
};

const heroSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      default: "",
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const introCardSchema = new mongoose.Schema(
  {
    paragraph: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const expertiseSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "",
      trim: true,
    },
    bulletPoints: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const strategySectionSchema = new mongoose.Schema(
  {
    operationalStrategyParagraph: {
      type: String,
      default: "",
      trim: true,
    },
    unifiedPhilosophyLabel: {
      type: String,
      default: "",
      trim: true,
    },
    unifiedPhilosophyParagraph: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const concludingStatementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const leadershipSchema = new mongoose.Schema(
  {
    hero: {
      type: heroSchema,
      default: () => ({ ...DEFAULT_HERO }),
    },
    introCard: {
      type: introCardSchema,
      default: () => ({ ...DEFAULT_INTRO_CARD }),
    },
    expertiseSection: {
      type: expertiseSectionSchema,
      default: () => ({
        ...DEFAULT_EXPERTISE_SECTION,
        bulletPoints: [...DEFAULT_EXPERTISE_SECTION.bulletPoints],
      }),
    },
    strategySection: {
      type: strategySectionSchema,
      default: () => ({ ...DEFAULT_STRATEGY_SECTION }),
    },
    concludingStatement: {
      type: concludingStatementSchema,
      default: () => ({ ...DEFAULT_CONCLUDING_STATEMENT }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leadership", leadershipSchema);
