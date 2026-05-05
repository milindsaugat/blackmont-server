const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const legalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["faq", "terms", "privacy"],
      required: true,
      trim: true,
    },
    eyebrowLabel: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    faqs: {
      type: [faqSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

legalSchema.index({ type: 1 }, { unique: true });

module.exports = mongoose.model("Legal", legalSchema, "legals");
