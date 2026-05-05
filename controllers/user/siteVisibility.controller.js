const SiteVisibility = require("../../models/siteVisibility.model");

const defaultVisibility = {
  pages: {
    home: true,
    about: true,
    services: true,
    insights: true,
    investorRelations: true,
    careers: true,
    contact: true,
    faq: true,
    terms: true,
    privacy: true,
    clientLogin: true,
  },
  homeSections: {
    hero: true,
    metalRates: true,
    aboutPreview: true,
    blackmontAdvantage: true,
    whoWeServe: true,
    whyBlackmont: true,
    servicesPreview: true,
    marketPreview: true,
    insightsPreview: true,
    contactCta: true,
  },
  investorSections: {
    overview: true,
    reports: true,
    stockInformation: true,
    eventsPresentations: true,
    corporateGovernance: true,
  },
};

const normalizeVisibility = (visibility) => {
  const homeSections = visibility.homeSections?.toObject?.() || visibility.homeSections || {};
  const blackmontAdvantage =
    homeSections.blackmontAdvantage ?? homeSections.whyBlackmont ?? true;

  visibility.pages = {
    ...defaultVisibility.pages,
    ...(visibility.pages?.toObject?.() || visibility.pages || {}),
  };
  visibility.homeSections = {
    ...defaultVisibility.homeSections,
    ...homeSections,
    blackmontAdvantage,
    whyBlackmont: blackmontAdvantage,
    whoWeServe: homeSections.whoWeServe ?? true,
  };
  visibility.investorSections = {
    ...defaultVisibility.investorSections,
    ...(visibility.investorSections?.toObject?.() || visibility.investorSections || {}),
  };

  return visibility;
};

async function getPublicSiteVisibility(req, res) {
  try {
    let visibility = await SiteVisibility.findOne();

    if (!visibility) {
      // If no settings exist, create defaults (all visible)
      visibility = await SiteVisibility.create(defaultVisibility);
    } else {
      normalizeVisibility(visibility);
      await visibility.save();
    }

    res.status(200).json({
      success: true,
      message: "Site visibility settings retrieved successfully",
      data: visibility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch site visibility settings",
      error: error.message,
    });
  }
}

module.exports = {
  getPublicSiteVisibility,
};
