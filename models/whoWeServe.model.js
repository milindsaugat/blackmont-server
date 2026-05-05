const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      trim: true,
      default: "users",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const whoWeServeSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      trim: true,
      default: "WHO WE SERVE",
    },
    heading: {
      type: String,
      trim: true,
      default: "Who We Serve",
    },
    subtitle: {
      type: String,
      trim: true,
      default:
        "Blackmont Capital works with clients and institutions seeking professional engagement with physical precious metals.",
    },
    cards: {
      type: [cardSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhoWeServe", whoWeServeSchema);
