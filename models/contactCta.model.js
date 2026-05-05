const mongoose = require("mongoose");

const contactCtaSchema = new mongoose.Schema(
  {
    eyebrowLabel: {
      type: String,
      trim: true,
      default: "PRIVATE ENGAGEMENT",
    },
    mainHeading: {
      type: String,
      trim: true,
      default: "Speak With Blackmont Capital",
    },
    description: {
      type: String,
      trim: true,
      default:
        "Connect with our team for bespoke guidance on physical gold stewardship, custody, and strategic precious metals positioning.",
    },
    buttonLabel: {
      type: String,
      trim: true,
      default: "CONTACT OUR TEAM",
    },
    buttonHref: {
      type: String,
      trim: true,
      default: "/contact",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactCta", contactCtaSchema);
