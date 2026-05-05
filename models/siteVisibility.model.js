const mongoose = require("mongoose");

const siteVisibilitySchema = new mongoose.Schema(
  {
    pages: {
      home: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      services: { type: Boolean, default: true },
      insights: { type: Boolean, default: true },
      investorRelations: { type: Boolean, default: true },
      careers: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
      faq: { type: Boolean, default: true },
      terms: { type: Boolean, default: true },
      privacy: { type: Boolean, default: true },
      clientLogin: { type: Boolean, default: true },
    },
    homeSections: {
      hero: { type: Boolean, default: true },
      metalRates: { type: Boolean, default: true },
      aboutPreview: { type: Boolean, default: true },
      blackmontAdvantage: { type: Boolean, default: true },
      whoWeServe: { type: Boolean, default: true },
      whyBlackmont: { type: Boolean, default: true },
      servicesPreview: { type: Boolean, default: true },
      marketPreview: { type: Boolean, default: true },
      insightsPreview: { type: Boolean, default: true },
      contactCta: { type: Boolean, default: true },
    },
    investorSections: {
      overview: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
      stockInformation: { type: Boolean, default: true },
      eventsPresentations: { type: Boolean, default: true },
      corporateGovernance: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteVisibility", siteVisibilitySchema);
