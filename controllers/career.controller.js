const Career = require("../models/career.model");

const DEFAULT_CAREER = {
  heroEyebrow: "CAREERS",
  heroTitle: "Careers at Blackmont",
  heroDescription:
    "Explore current opportunities and apply for roles aligned with disciplined stewardship, precision, and institutional service.",
  openPositions: {
    eyebrowLabel: "CURRENT OPPORTUNITIES",
    heading: "Open Positions",
    description:
      "View available roles and submit your application for future consideration.",
  },
  jobs: [],
  applicationProcess: {
    eyebrowLabel: "HOW IT WORKS",
    heading: "Application Process",
    steps: [],
  },
  futureOpportunities: {
    eyebrowLabel: "FUTURE OPPORTUNITIES",
    heading: "Interested in future opportunities?",
    description:
      "If a suitable role is not currently listed, you may submit a general expression of interest and we will review it with institutional care.",
    buttonLabel: "CONTACT BLACKMONT",
    buttonHref: "/contact",
  },
  isActive: true,
};

async function getOrCreateCareer() {
  let data = await Career.findOne();

  if (!data) {
    data = await Career.create(DEFAULT_CAREER);
  }

  return data;
}

function getPublicCareerData(data) {
  const responseData = data.toObject();

  responseData.header = {
    heroEyebrow: responseData.heroEyebrow || "",
    heroTitle: responseData.heroTitle || "",
    heroDescription: responseData.heroDescription || "",
  };

  responseData.jobs = responseData.jobs
    .filter((job) => job.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((job) => ({
      ...job,
      applyNowLink: job.applyNowLink || job.applyLink || "",
      buttonLabel: job.buttonLabel || "Apply Now",
    }));

  responseData.applicationProcess = {
    sectionEyebrowLabel:
      responseData.applicationProcess?.sectionEyebrowLabel ||
      responseData.applicationProcess?.eyebrowLabel ||
      "",
    sectionHeading:
      responseData.applicationProcess?.sectionHeading ||
      responseData.applicationProcess?.heading ||
      "",
    steps: (responseData.applicationProcess?.steps || [])
      .filter((step) => step.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  };

  return responseData;
}

async function getCareers(req, res) {
  try {
    const data = await getOrCreateCareer();

    if (!data.isActive) {
      return res.status(404).json({
        success: false,
        message: "Careers page is inactive",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Careers CMS fetched successfully",
      data: getPublicCareerData(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Careers CMS",
      error: error.message,
    });
  }
}

async function getCareerJobBySlug(req, res) {
  try {
    const { slug } = req.params;
    const data = await getOrCreateCareer();

    if (!data.isActive) {
      return res.status(404).json({
        success: false,
        message: "Careers page is inactive",
        data: null,
      });
    }

    const job = data.jobs.find((item) => {
      return item.slug === slug && item.isActive;
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Career job not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Career job fetched successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch career job",
      error: error.message,
    });
  }
}

module.exports = {
  getCareers,
  getCareerJobBySlug,
};