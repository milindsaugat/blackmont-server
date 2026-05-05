const Newsroom = require("../models/newsroom.model");

const DEFAULT_NEWSROOM = {
  sectionEyebrowLabel: "LATEST UPDATES",
  sectionHeading: "News and commentary with institutional clarity",
  sectionDescription:
    "Explore concise updates and perspective pieces shaped by Blackmont's stewardship-led view of physical gold and hard-asset governance.",
  disclaimerText: "",
  articles: [
    {
      categoryPrefix: "COMMENTARY 01",
      title: "The Role of Gold in Institutional Portfolios",
      excerpt:
        "A concise perspective on how physical bullion continues to serve as a strategic stabiliser within long-term capital frameworks.",
      slug: "the-role-of-gold-in-institutional-portfolios",
      readMoreLink: "/newsroom/the-role-of-gold-in-institutional-portfolios",
      isPublished: true,
      order: 1,
    },
    {
      categoryPrefix: "COMMENTARY 02",
      title: "Understanding Structured Bullion Custody",
      excerpt:
        "An overview of custody considerations, operational confidence, and institutional handling standards for physical assets.",
      slug: "understanding-structured-bullion-custody",
      readMoreLink: "/newsroom/understanding-structured-bullion-custody",
      isPublished: true,
      order: 2,
    },
    {
      categoryPrefix: "COMMENTARY 03",
      title: "Market Stability and Precious Metals",
      excerpt:
        "A high-level commentary on why hard assets continue to attract attention during periods of uncertainty and repricing.",
      slug: "market-stability-and-precious-metals",
      readMoreLink: "/newsroom/market-stability-and-precious-metals",
      isPublished: true,
      order: 3,
    },
  ],
  isActive: true,
};

const getOrCreateNewsroom = async () => {
  let data = await Newsroom.findOne();

  if (!data) {
    data = await Newsroom.create(DEFAULT_NEWSROOM);
  }

  return data;
};

const getPublishedNewsroomData = (data) => {
  const responseData = data.toObject();

  responseData.articles = responseData.articles
    .filter((article) => article.isPublished)
    .sort((a, b) => {
      const orderDifference = (a.order || 0) - (b.order || 0);
      if (orderDifference !== 0) return orderDifference;

      const aCreatedAt = a.createdAt
        ? new Date(a.createdAt).getTime()
        : a._id?.getTimestamp?.().getTime?.() || 0;
      const bCreatedAt = b.createdAt
        ? new Date(b.createdAt).getTime()
        : b._id?.getTimestamp?.().getTime?.() || 0;

      return bCreatedAt - aCreatedAt;
    });

  return responseData;
};

const getNewsroom = async (req, res) => {
  try {
    const data = await getOrCreateNewsroom();

    if (!data.isActive) {
      return res.status(404).json({
        success: false,
        message: "Newsroom section is inactive",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Newsroom section fetched successfully",
      data: getPublishedNewsroomData(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch newsroom section",
      error: error.message,
    });
  }
};

const getNewsroomArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await getOrCreateNewsroom();

    if (!data.isActive) {
      return res.status(404).json({
        success: false,
        message: "Newsroom section is inactive",
        data: null,
      });
    }

    const article = data.articles.find((item) => {
      return item.slug === slug && item.isPublished;
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Newsroom article not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Newsroom article fetched successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch newsroom article",
      error: error.message,
    });
  }
};

const getNewsroomArticleById = async (req, res) => {
  try {
    const { articleId } = req.params;
    const data = await getOrCreateNewsroom();

    if (!data.isActive) {
      return res.status(404).json({
        success: false,
        message: "Newsroom section is inactive",
        data: null,
      });
    }

    const article = data.articles.id(articleId);

    if (!article || !article.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Newsroom article not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Newsroom article fetched successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch newsroom article",
      error: error.message,
    });
  }
};

module.exports = {
  getNewsroom,
  getNewsroomArticleById,
  getNewsroomArticleBySlug,
};
