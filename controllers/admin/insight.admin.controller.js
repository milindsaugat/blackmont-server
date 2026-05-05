const Insight = require("../../models/insight.model");
const InsightHeader = require("../../models/insightHeader.model");
const fs = require("fs");
const path = require("path");

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

// GET all insights (admin)
const getAllInsightsAdmin = async (req, res) => {
  try {
    // Seed default articles if needed
    await seedDefaultArticles();

    const { published, featured } = req.query;
    const filter = {};

    if (published !== undefined) {
      filter.isPublished = published === "true";
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }

    const insights = await Insight.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      message: "Insights fetched successfully",
      data: insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insights",
      error: error.message,
    });
  }
};

// GET single insight (admin)
const getSingleInsightAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await Insight.findById(id);

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

// CREATE insight
const createInsight = async (req, res) => {
  try {
    const {
      title,
      slug,
      categoryTag,
      date,
      readTime,
      excerpt,
      readMoreLink,
      isFeatured,
      isPublished,
      order,
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!excerpt) {
      return res.status(400).json({
        success: false,
        message: "Excerpt is required",
      });
    }

    const insightData = {
      title,
      categoryTag,
      date,
      readTime,
      excerpt,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isPublished: isPublished === "true" || isPublished === true,
      order: order ? parseInt(order) : 0,
    };

    // Add slug if provided, else it will be generated in pre-save
    if (slug) {
      insightData.slug = slug;
    }

    // Add readMoreLink if provided
    if (readMoreLink) {
      insightData.readMoreLink = readMoreLink;
    }

    // Handle thumbnail upload
    if (req.file) {
      const thumbnailUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/insights/${req.file.filename}`;
      insightData.thumbnailUrl = thumbnailUrl;
    }

    const insight = await Insight.create(insightData);

    res.status(201).json({
      success: true,
      message: "Insight created successfully",
      data: insight,
    });
  } catch (error) {
    // Delete uploaded file if creation fails
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../../uploads/insights",
        req.file.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create insight",
      error: error.message,
    });
  }
};

// UPDATE insight
const updateInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      categoryTag,
      date,
      readTime,
      excerpt,
      readMoreLink,
      isFeatured,
      isPublished,
      order,
    } = req.body;

    const insight = await Insight.findById(id);

    if (!insight) {
      // Delete uploaded file if insight not found
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../uploads/insights",
          req.file.filename
        );
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }

      return res.status(404).json({
        success: false,
        message: "Insight not found",
        data: null,
      });
    }

    // Update fields
    if (title !== undefined) insight.title = title;
    if (slug !== undefined) insight.slug = slug;
    if (categoryTag !== undefined) insight.categoryTag = categoryTag;
    if (date !== undefined) insight.date = date;
    if (readTime !== undefined) insight.readTime = readTime;
    if (excerpt !== undefined) insight.excerpt = excerpt;
    if (readMoreLink !== undefined) insight.readMoreLink = readMoreLink;
    if (isFeatured !== undefined)
      insight.isFeatured = isFeatured === "true" || isFeatured === true;
    if (isPublished !== undefined)
      insight.isPublished = isPublished === "true" || isPublished === true;
    if (order !== undefined) insight.order = parseInt(order);

    // Handle new thumbnail
    if (req.file) {
      // Delete old thumbnail if exists
      if (insight.thumbnailUrl) {
        const oldFilename = insight.thumbnailUrl.split("/").pop();
        const oldFilePath = path.join(
          __dirname,
          "../../uploads/insights",
          oldFilename
        );
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Failed to delete old file:", err);
        });
      }

      const thumbnailUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/insights/${req.file.filename}`;
      insight.thumbnailUrl = thumbnailUrl;
    }

    const updatedInsight = await insight.save();

    res.status(200).json({
      success: true,
      message: "Insight updated successfully",
      data: updatedInsight,
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../../uploads/insights",
        req.file.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update insight",
      error: error.message,
    });
  }
};

// DELETE insight
const deleteInsight = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await Insight.findById(id);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
        data: null,
      });
    }

    // Delete thumbnail if exists
    if (insight.thumbnailUrl) {
      const filename = insight.thumbnailUrl.split("/").pop();
      const filePath = path.join(
        __dirname,
        "../../uploads/insights",
        filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    await Insight.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Insight deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete insight",
      error: error.message,
    });
  }
};

// TOGGLE featured
const toggleFeaturedInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    if (isFeatured === undefined) {
      return res.status(400).json({
        success: false,
        message: "isFeatured field is required",
      });
    }

    const insight = await Insight.findByIdAndUpdate(
      id,
      { isFeatured: isFeatured === "true" || isFeatured === true },
      { new: true, runValidators: true }
    );

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Insight featured status updated successfully",
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
      error: error.message,
    });
  }
};

// TOGGLE published
const togglePublishedInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    if (isPublished === undefined) {
      return res.status(400).json({
        success: false,
        message: "isPublished field is required",
      });
    }

    const insight = await Insight.findByIdAndUpdate(
      id,
      { isPublished: isPublished === "true" || isPublished === true },
      { new: true, runValidators: true }
    );

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Insight published status updated successfully",
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle published status",
      error: error.message,
    });
  }
};

// GET insight header (admin)
const getInsightHeaderAdmin = async (req, res) => {
  try {
    let header = await InsightHeader.findOne();

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

// PATCH insight header (admin)
const updateInsightHeader = async (req, res) => {
  try {
    const {
      sectionEyebrowLabel,
      sectionHeading,
      sectionDescription,
      isActive,
    } = req.body;

    let header = await InsightHeader.findOne();

    // Create default header if none exists
    if (!header) {
      header = await InsightHeader.create({
        sectionEyebrowLabel:
          sectionEyebrowLabel || "Insights & Commentary",
        sectionHeading: sectionHeading || "Blackmont Journal",
        sectionDescription:
          sectionDescription ||
          "Perspectives on physical gold, wealth preservation, custody, and strategic asset stewardship.",
        isActive: isActive !== undefined ? isActive : true,
      });
    } else {
      // Update only provided fields
      if (sectionEyebrowLabel !== undefined)
        header.sectionEyebrowLabel = sectionEyebrowLabel;
      if (sectionHeading !== undefined)
        header.sectionHeading = sectionHeading;
      if (sectionDescription !== undefined)
        header.sectionDescription = sectionDescription;
      if (isActive !== undefined) header.isActive = isActive;

      await header.save();
    }

    res.status(200).json({
      success: true,
      message: "Insight header updated successfully",
      data: header,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update insight header",
      error: error.message,
    });
  }
};

module.exports = {
  getAllInsightsAdmin,
  getSingleInsightAdmin,
  createInsight,
  updateInsight,
  deleteInsight,
  toggleFeaturedInsight,
  togglePublishedInsight,
  getInsightHeaderAdmin,
  updateInsightHeader,
};
