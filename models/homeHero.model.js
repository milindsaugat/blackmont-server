const mongoose = require("mongoose");

const DEFAULT_HOME_HERO = {
  eyebrow: "BEYOND BULLION",
  heading: "Beyond Traditional Bullion Ownership",
  description:
    "Direct ownership, secure custody, and structured deployment of physical gold within a disciplined and transparent framework. Designed for institutions and private clients seeking clarity, control, and long-term alignment in precious metals.",
  primaryButtonText: "Explore Services",
  primaryButtonLink: "/services",
  secondaryButtonText: "Private Advisory",
  secondaryButtonLink: "/contact",
  isActive: true,
};

const homeHeroSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.eyebrow,
    },
    heading: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.heading,
    },
    description: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.description,
    },
    primaryButtonText: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.primaryButtonText,
    },
    primaryButtonLink: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.primaryButtonLink,
    },
    secondaryButtonText: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.secondaryButtonText,
    },
    secondaryButtonLink: {
      type: String,
      trim: true,
      default: DEFAULT_HOME_HERO.secondaryButtonLink,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

homeHeroSchema.statics.defaultData = function () {
  return { ...DEFAULT_HOME_HERO };
};

module.exports = mongoose.model("HomeHero", homeHeroSchema);
