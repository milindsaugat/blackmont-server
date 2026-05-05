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

const normalizeHomeSections = (homeSections = {}) => {
  const legacyAdvantage =
    homeSections.blackmontAdvantage ?? homeSections.whyBlackmont ?? true;

  return {
    ...defaultVisibility.homeSections,
    ...homeSections,
    blackmontAdvantage: legacyAdvantage,
    whyBlackmont: legacyAdvantage,
    whoWeServe: homeSections.whoWeServe ?? true,
  };
};

const normalizeVisibility = (visibility) => {
  visibility.pages = {
    ...defaultVisibility.pages,
    ...(visibility.pages?.toObject?.() || visibility.pages || {}),
  };
  visibility.homeSections = normalizeHomeSections(
    visibility.homeSections?.toObject?.() || visibility.homeSections || {}
  );
  visibility.investorSections = {
    ...defaultVisibility.investorSections,
    ...(visibility.investorSections?.toObject?.() || visibility.investorSections || {}),
  };
  return visibility;
};

async function getSiteVisibility(req, res) {
  try {
    let visibility = await SiteVisibility.findOne();

    if (!visibility) {
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

async function updateSiteVisibility(req, res) {
  try {
    const { pages, homeSections, investorSections } = req.body;

    let visibility = await SiteVisibility.findOne();

    if (!visibility) {
      visibility = await SiteVisibility.create({
        pages: { ...defaultVisibility.pages, ...(pages || {}) },
        homeSections: normalizeHomeSections(homeSections || {}),
        investorSections: {
          ...defaultVisibility.investorSections,
          ...(investorSections || {}),
        },
      });
    } else {
      if (pages) {
        visibility.pages = {
          ...(visibility.pages?.toObject?.() || visibility.pages || {}),
          ...pages,
        };
      }
      if (homeSections) {
        visibility.homeSections = normalizeHomeSections({
          ...(visibility.homeSections?.toObject?.() || visibility.homeSections || {}),
          ...homeSections,
        });
      } else {
        normalizeVisibility(visibility);
      }
      if (investorSections) {
        visibility.investorSections = {
          ...(visibility.investorSections?.toObject?.() || visibility.investorSections || {}),
          ...investorSections,
        };
      }
      normalizeVisibility(visibility);
      await visibility.save();
    }

    res.status(200).json({
      success: true,
      message: "Site visibility settings updated successfully",
      data: visibility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update site visibility settings",
      error: error.message,
    });
  }
}

module.exports = {
  getSiteVisibility,
  updateSiteVisibility,
};
