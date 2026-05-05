const WhoWeServe = require("../../models/whoWeServe.model");

const DEFAULT_WHO_WE_SERVE = {
  eyebrow: "WHO WE SERVE",
  heading: "Who We Serve",
  subtitle:
    "Blackmont Capital works with clients and institutions seeking professional engagement with physical precious metals.",
  cards: [
    {
      icon: "users",
      title: "High Net Worth Individuals",
      description:
        "Private clients seeking professional precious metals stewardship and strategic gold allocation within diversified portfolios.",
      sortOrder: 1,
      isActive: true,
    },
    {
      icon: "family",
      title: "Family Offices",
      description:
        "Multi-generational wealth management entities requiring bullion custody and structured asset utilisation frameworks.",
      sortOrder: 2,
      isActive: true,
    },
    {
      icon: "landmark",
      title: "Institutions",
      description:
        "Corporate and institutional holders seeking professional precious metals management and secure custody arrangements.",
      sortOrder: 3,
      isActive: true,
    },
    {
      icon: "building",
      title: "Corporate Treasury Holders",
      description:
        "Corporate entities and treasury departments seeking structured management of physical gold reserves as part of broader balance sheet and asset preservation strategies.",
      sortOrder: 4,
      isActive: true,
    },
    {
      icon: "badge-users",
      title: "Precious Metals Clients",
      description:
        "Established bullion market participants seeking a more structured and professionally governed platform for the ongoing management, custody, and strategic utilisation of their existing physical gold holdings.",
      sortOrder: 5,
      isActive: true,
    },
  ],
};

const sortCards = (cards = []) =>
  cards
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((card, index) => ({
      icon: card.icon || "users",
      title: card.title || "",
      description: card.description || "",
      sortOrder: card.sortOrder || index + 1,
      isActive: card.isActive !== false,
      _id: card._id,
    }));

const getOrCreateWhoWeServe = async () => {
  let data = await WhoWeServe.findOne();

  if (!data) {
    data = await WhoWeServe.create(DEFAULT_WHO_WE_SERVE);
  }

  data.cards = sortCards(data.cards);
  return data;
};

const getWhoWeServeAdmin = async (req, res) => {
  try {
    const data = await getOrCreateWhoWeServe();

    res.status(200).json({
      success: true,
      message: "Who We Serve section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Who We Serve section",
      error: error.message,
    });
  }
};

const upsertWhoWeServe = async (req, res) => {
  try {
    const { eyebrow, heading, subtitle, cards } = req.body;

    const payload = {
      eyebrow: eyebrow ?? DEFAULT_WHO_WE_SERVE.eyebrow,
      heading: heading ?? DEFAULT_WHO_WE_SERVE.heading,
      subtitle: subtitle ?? DEFAULT_WHO_WE_SERVE.subtitle,
      cards: sortCards(Array.isArray(cards) ? cards : []),
    };

    const data = await WhoWeServe.findOneAndUpdate({}, { $set: payload }, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    data.cards = sortCards(data.cards);

    res.status(200).json({
      success: true,
      message: "Who We Serve section saved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save Who We Serve section",
      error: error.message,
    });
  }
};

module.exports = {
  getWhoWeServeAdmin,
  upsertWhoWeServe,
};
