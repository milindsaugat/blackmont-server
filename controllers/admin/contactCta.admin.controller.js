const ContactCta = require("../../models/contactCta.model");

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

const getContactCtaAdmin = async (req, res) => {
  try {
    const data = await getSingleContactCta();

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

const upsertContactCta = async (req, res) => {
  try {
    const data = await getSingleContactCta();

    const fields = [
      "eyebrowLabel",
      "mainHeading",
      "description",
      "buttonLabel",
      "buttonHref",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    await data.save();

    res.status(200).json({
      success: true,
      message: "Contact CTA section updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Contact CTA section",
      error: error.message,
    });
  }
};

module.exports = {
  getContactCtaAdmin,
  upsertContactCta,
};