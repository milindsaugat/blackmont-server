const ContactCta = require("../models/contactCta.model");

const DEFAULT_CONTACT_CTA = {
  eyebrowLabel: "PRIVATE ENGAGEMENT",
  mainHeading: "Speak With Blackmont Capital",
  description:
    "Connect with our team for bespoke guidance on physical gold stewardship, custody, and strategic precious metals positioning.",
  buttonLabel: "CONTACT OUR TEAM",
  buttonHref: "/contact",
  isActive: true,
};

const getSingleContactCta = async () => {
  const all = await ContactCta.find().sort({ updatedAt: -1, createdAt: -1 });

  if (all.length === 0) {
    return await ContactCta.create(DEFAULT_CONTACT_CTA);
  }

  const keep = all[0];

  if (all.length > 1) {
    const deleteIds = all.slice(1).map((item) => item._id);
    await ContactCta.deleteMany({ _id: { $in: deleteIds } });
  }

  return keep;
};

const getContactCta = async (req, res) => {
  try {
    const data = await getSingleContactCta();

    if (!data.isActive) {
      return res.status(404).json({
        success: false,
        message: "Contact CTA section is inactive",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact CTA section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Contact CTA section",
      error: error.message,
    });
  }
};

module.exports = {
  getContactCta,
};