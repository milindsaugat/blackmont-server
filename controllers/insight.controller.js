const Insight = require("../models/insight.model");
const InsightHeader = require("../models/insightHeader.model");

// Helper: Seed default articles if database is empty
const seedDefaultArticles = async () => {
  const count = await Insight.countDocuments();

  if (count === 0) {
    const defaultArticles = [
      {
        title: "Why Gold Continues to Matter in Modern Wealth Preservation",
        slug: "why-gold-continues-to-matter-in-modern-wealth-preservation",
        categoryTag: "MARKET INSIGHT",
        date: "April 2026",
        readTime: "5 min read",
        excerpt:
          "Gold remains one of the few globally recognised assets that can support portfolio resilience during periods of inflation, currency volatility, and geopolitical uncertainty.",
        readMoreLink:
          "/insights/why-gold-continues-to-matter-in-modern-wealth-preservation",
        isFeatured: true,
        isPublished: true,
        order: 1,
      },
      {
        title:
          "The Role of Secure Custody in Professional Precious Metals Stewardship",
        slug: "the-role-of-secure-custody-in-professional-precious-metals-stewardship",
        categoryTag: "STRATEGY",
        date: "April 2026",
        readTime: "4 min read",
        excerpt:
          "Institutional-grade custody, verification, and reporting processes help preserve asset integrity and strengthen confidence in long-term physical gold holdings.",
        readMoreLink:
          "/insights/the-role-of-secure-custody-in-professional-precious-metals-stewardship",
        isFeatured: true,
        isPublished: true,
        order: 2,
      },
      {
        title:
          "Physical Gold in Diversified Portfolios: A Strategic Perspective",
        slug: "physical-gold-in-diversified-portfolios-a-strategic-perspective",
        categoryTag: "ADVISORY",
        date: "April 2026",
        readTime: "6 min read",
        excerpt:
          "From family offices to institutional investors, physical gold can serve a strategic role alongside broader asset allocation and preservation objectives.",
        readMoreLink:
          "/insights/physical-gold-in-diversified-portfolios-a-strategic-perspective",
        isFeatured: true,
        isPublished: true,
        order: 3,
      },
    ];

    await Insight.insertMany(defaultArticles);
  }
};

// GET all published insights
const getPublishedInsights = async (req, res) => {
  try {
    // Seed default articles if needed
    await seedDefaultArticles();

    const insights = await Insight.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      message: "Published insights fetched successfully",
      data: insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch published insights",
      error: error.message,
    });
  }
};

// GET featured insights
const getFeaturedInsights = async (req, res) => {
  try {
    // Seed default articles if needed
    await seedDefaultArticles();

    const limit = req.query.limit ? parseInt(req.query.limit) : 3;

    const insights = await Insight.find({
      isPublished: true,
      isFeatured: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .exec();

    res.status(200).json({
      success: true,
      message: "Featured insights fetched successfully",
      data: insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured insights",
      error: error.message,
    });
  }
};

// GET single insight by id or slug
const getInsightBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Seed default articles if needed
    await seedDefaultArticles();

    const filter = { isPublished: true };

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      filter._id = slug;
    } else {
      filter.slug = slug;
    }

    const insight = await Insight.findOne(filter);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Insight fetched successfully",
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insight",
      error: error.message,
    });
  }
};

// GET insight header (public)
const getInsightHeader = async (req, res) => {
  try {
    let header = await InsightHeader.findOne({ isActive: true });

    // Create default header if none exists
    if (!header) {
      header = await InsightHeader.create({
        sectionEyebrowLabel: "Insights & Commentary",
        sectionHeading: "Blackmont Journal",
        sectionDescription:
          "Perspectives on physical gold, wealth preservation, custody, and strategic asset stewardship.",
        isActive: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Insight header fetched successfully",
      data: header,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insight header",
      error: error.message,
    });
  }
};

module.exports = {
  getPublishedInsights,
  getFeaturedInsights,
  getInsightBySlug,
  getInsightHeader,
};
