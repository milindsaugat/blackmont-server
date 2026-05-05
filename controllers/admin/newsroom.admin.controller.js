const Newsroom = require("../../models/newsroom.model");
const fs = require("fs");
const path = require("path");

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

const slugify = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined) return defaultValue;
  return value === true || value === "true";
};

const parseOrder = (value, defaultValue = 0) => {
  if (value === undefined || value === "") return defaultValue;
  return parseInt(value, 10);
};

const sortArticles = (data) => {
  if (data?.articles) {
    data.articles.sort((a, b) => {
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
  }

  return data;
};

const getThumbnailUrl = (req) => {
  if (!req.file) return "";
  return `${req.protocol}://${req.get("host")}/uploads/newsroom/${
    req.file.filename
  }`;
};

const deleteUploadedFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(__dirname, "../../uploads/newsroom", filename);

  fs.unlink(filePath, (error) => {
    if (error) console.error("Failed to delete newsroom image:", error);
  });
};

const getFilenameFromUrl = (url) => {
  if (!url) return "";
  return url.split("/").pop();
};

const getOrCreateNewsroom = async () => {
  let data = await Newsroom.findOne();

  if (!data) {
    data = await Newsroom.create(DEFAULT_NEWSROOM);
  }

  return sortArticles(data);
};

const getNewsroomAdmin = async (req, res) => {
  try {
    const data = await getOrCreateNewsroom();

    res.status(200).json({
      success: true,
      message: "Newsroom section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch newsroom section",
      error: error.message,
    });
  }
};

const upsertNewsroomHeader = async (req, res) => {
  try {
    const {
      sectionEyebrowLabel,
      sectionHeading,
      sectionDescription,
      disclaimerText,
      isActive,
    } = req.body;

    const data = await getOrCreateNewsroom();

    if (sectionEyebrowLabel !== undefined) {
      data.sectionEyebrowLabel = sectionEyebrowLabel;
    }
    if (sectionHeading !== undefined) data.sectionHeading = sectionHeading;
    if (sectionDescription !== undefined) {
      data.sectionDescription = sectionDescription;
    }
    if (disclaimerText !== undefined) data.disclaimerText = disclaimerText;
    if (isActive !== undefined) data.isActive = parseBoolean(isActive);

    await data.save();
    sortArticles(data);

    res.status(200).json({
      success: true,
      message: "Newsroom header updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update newsroom header",
      error: error.message,
    });
  }
};

const addNewsroomArticle = async (req, res) => {
  try {
    const {
      title,
      categoryPrefix,
      date,
      excerpt,
      readMoreLink,
      slug,
      isPublished,
      order,
    } = req.body;

    if (!title || !categoryPrefix || !excerpt) {
      if (req.file) deleteUploadedFile(req.file.filename);

      return res.status(400).json({
        success: false,
        message: "Title, category and excerpt are required",
      });
    }

    const data = await getOrCreateNewsroom();
    const articleSlug = slug ? slugify(slug) : slugify(title);

    data.articles.push({
      thumbnailUrl: getThumbnailUrl(req),
      title,
      categoryPrefix: categoryPrefix || "",
      date: date || "",
      excerpt,
      readMoreLink: readMoreLink || `/newsroom/${articleSlug}`,
      slug: articleSlug,
      isPublished: parseBoolean(isPublished),
      order: parseOrder(order, data.articles.length + 1),
    });

    await data.save();
    sortArticles(data);

    res.status(201).json({
      success: true,
      message: "Newsroom article added successfully",
      data,
    });
  } catch (error) {
    if (req.file) deleteUploadedFile(req.file.filename);

    res.status(500).json({
      success: false,
      message: "Failed to add newsroom article",
      error: error.message,
    });
  }
};

const updateNewsroomArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const {
      title,
      categoryPrefix,
      date,
      excerpt,
      readMoreLink,
      slug,
      isPublished,
      order,
    } = req.body;

    const data = await getOrCreateNewsroom();
    const article = data.articles.id(articleId);

    if (!article) {
      if (req.file) deleteUploadedFile(req.file.filename);

      return res.status(404).json({
        success: false,
        message: "Newsroom article not found",
        data: null,
      });
    }

    const previousSlug = article.slug;

    if (title !== undefined) article.title = title;
    if (categoryPrefix !== undefined) article.categoryPrefix = categoryPrefix;
    if (date !== undefined) article.date = date;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (isPublished !== undefined) {
      article.isPublished = parseBoolean(isPublished);
    }
    if (order !== undefined) article.order = parseOrder(order);

    if (slug !== undefined && slug !== "") {
      article.slug = slugify(slug);
    } else if (!article.slug && article.title) {
      article.slug = slugify(article.title);
    }

    if (readMoreLink !== undefined) {
      article.readMoreLink = readMoreLink;
    } else if (!article.readMoreLink || article.slug !== previousSlug) {
      article.readMoreLink = `/newsroom/${article.slug}`;
    }

    if (req.file) {
      deleteUploadedFile(getFilenameFromUrl(article.thumbnailUrl));
      article.thumbnailUrl = getThumbnailUrl(req);
    }

    await data.save();
    sortArticles(data);

    res.status(200).json({
      success: true,
      message: "Newsroom article updated successfully",
      data,
    });
  } catch (error) {
    if (req.file) deleteUploadedFile(req.file.filename);

    res.status(500).json({
      success: false,
      message: "Failed to update newsroom article",
      error: error.message,
    });
  }
};

const deleteNewsroomArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const data = await getOrCreateNewsroom();
    const article = data.articles.id(articleId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Newsroom article not found",
        data: null,
      });
    }

    deleteUploadedFile(getFilenameFromUrl(article.thumbnailUrl));
    article.deleteOne();

    await data.save();
    sortArticles(data);

    res.status(200).json({
      success: true,
      message: "Newsroom article deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete newsroom article",
      error: error.message,
    });
  }
};

const toggleNewsroomArticlePublished = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { isPublished } = req.body;

    if (isPublished === undefined) {
      return res.status(400).json({
        success: false,
        message: "isPublished field is required",
      });
    }

    const data = await getOrCreateNewsroom();
    const article = data.articles.id(articleId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Newsroom article not found",
        data: null,
      });
    }

    article.isPublished = parseBoolean(isPublished);

    await data.save();
    sortArticles(data);

    res.status(200).json({
      success: true,
      message: "Newsroom article published status updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update newsroom article published status",
      error: error.message,
    });
  }
};

module.exports = {
  getNewsroomAdmin,
  upsertNewsroomHeader,
  addNewsroomArticle,
  updateNewsroomArticle,
  deleteNewsroomArticle,
  toggleNewsroomArticlePublished,
};
