const mongoose = require("mongoose");

const newsroomArticleSchema = new mongoose.Schema(
  {
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    categoryPrefix: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      trim: true,
      default: "",
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    readMoreLink: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true, timestamps: true }
);

const newsroomSchema = new mongoose.Schema(
  {
    sectionEyebrowLabel: {
      type: String,
      trim: true,
      default: "LATEST UPDATES",
    },
    sectionHeading: {
      type: String,
      trim: true,
      default: "News and commentary with institutional clarity",
    },
    sectionDescription: {
      type: String,
      trim: true,
      default:
        "Explore concise updates and perspective pieces shaped by Blackmont's stewardship-led view of physical gold and hard-asset governance.",
    },
    disclaimerText: {
      type: String,
      trim: true,
      default: "",
    },
    articles: {
      type: [newsroomArticleSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsroom", newsroomSchema);
