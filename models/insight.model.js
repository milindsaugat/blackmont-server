const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryTag: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    readTime: {
      type: String,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    readMoreLink: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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
  { timestamps: true }
);

// Pre-save middleware to generate slug if not provided
insightSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  if (!this.readMoreLink) {
    this.readMoreLink = `/insights/${this.slug}`;
  }
});

module.exports = mongoose.model("Insight", insightSchema);
