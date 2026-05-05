const Leadership = require("../../models/leadership.model");

const getOrCreateLeadership = async () => {
  let leadership = await Leadership.findOne();

  if (!leadership) {
    leadership = await Leadership.create({});
  }

  return leadership;
};

const normalizeHero = (hero) => {
  if (!hero || typeof hero !== "object") return undefined;

  return {
    pageTitle: hero.pageTitle || "",
    heroSubtitle: hero.heroSubtitle || "",
  };
};

const normalizeIntroCard = (introCard) => {
  if (!introCard || typeof introCard !== "object") return undefined;

  return {
    paragraph: introCard.paragraph || "",
  };
};

const normalizeExpertiseSection = (expertiseSection) => {
  if (!expertiseSection || typeof expertiseSection !== "object") {
    return undefined;
  }

  return {
    heading: expertiseSection.heading || "",
    bulletPoints: Array.isArray(expertiseSection.bulletPoints)
      ? expertiseSection.bulletPoints.map((point) => String(point || ""))
      : [],
  };
};

const normalizeStrategySection = (strategySection) => {
  if (!strategySection || typeof strategySection !== "object") {
    return undefined;
  }

  return {
    operationalStrategyParagraph:
      strategySection.operationalStrategyParagraph || "",
    unifiedPhilosophyLabel: strategySection.unifiedPhilosophyLabel || "",
    unifiedPhilosophyParagraph:
      strategySection.unifiedPhilosophyParagraph || "",
  };
};

const normalizeConcludingStatement = (concludingStatement) => {
  if (!concludingStatement || typeof concludingStatement !== "object") {
    return undefined;
  }

  return {
    text: concludingStatement.text || "",
  };
};

const getAdminLeadership = async (req, res) => {
  try {
    const leadership = await getOrCreateLeadership();

    res.status(200).json({
      success: true,
      message: "Leadership fetched successfully",
      data: leadership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Leadership",
      error: error.message,
    });
  }
};

const updateLeadership = async (req, res) => {
  try {
    const {
      hero,
      introCard,
      expertiseSection,
      strategySection,
      concludingStatement,
    } = req.body;

    const updateData = {};
    const normalizedHero = normalizeHero(hero);
    const normalizedIntroCard = normalizeIntroCard(introCard);
    const normalizedExpertiseSection =
      normalizeExpertiseSection(expertiseSection);
    const normalizedStrategySection = normalizeStrategySection(strategySection);
    const normalizedConcludingStatement =
      normalizeConcludingStatement(concludingStatement);

    if (normalizedHero !== undefined) updateData.hero = normalizedHero;
    if (normalizedIntroCard !== undefined) {
      updateData.introCard = normalizedIntroCard;
    }
    if (normalizedExpertiseSection !== undefined) {
      updateData.expertiseSection = normalizedExpertiseSection;
    }
    if (normalizedStrategySection !== undefined) {
      updateData.strategySection = normalizedStrategySection;
    }
    if (normalizedConcludingStatement !== undefined) {
      updateData.concludingStatement = normalizedConcludingStatement;
    }

    const leadership = await Leadership.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Leadership updated successfully",
      data: leadership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Leadership",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminLeadership,
  updateLeadership,
};
