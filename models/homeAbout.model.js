const mongoose = require("mongoose");

const homeAboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "About Blackmont",
      trim: true,
    },

    description: {
      type: String,
      default:
        "A modern precious metals enterprise built on disciplined stewardship, institutional clarity, and long-term client alignment.",
      trim: true,
    },

    images: [
      {
        imageUrl: {
          type: String,
          required: true,
          trim: true,
        },
        altText: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    cards: [
      {
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
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeAbout", homeAboutSchema);
