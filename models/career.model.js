const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    employmentType: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    fullDescription: {
      type: String,
      trim: true,
      default: "",
    },
    applyNowLink: {
      type: String,
      trim: true,
      default: "",
    },
    applyLink: {
      type: String,
      trim: true,
      default: "",
    },
    buttonLabel: {
      type: String,
      trim: true,
      default: "Apply Now",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const processStepSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const careerSchema = new mongoose.Schema(
  {
    heroEyebrow: {
      type: String,
      trim: true,
      default: "CAREERS",
    },
    heroTitle: {
      type: String,
      trim: true,
      default: "Careers at Blackmont",
    },
    heroDescription: {
      type: String,
      trim: true,
      default:
        "Explore current opportunities and apply for roles aligned with disciplined stewardship, precision, and institutional service.",
    },
    openPositions: {
      eyebrowLabel: {
        type: String,
        trim: true,
        default: "CURRENT OPPORTUNITIES",
      },
      heading: {
        type: String,
        trim: true,
        default: "Open Positions",
      },
      description: {
        type: String,
        trim: true,
        default:
          "View available roles and submit your application for future consideration.",
      },
    },
    jobs: {
      type: [jobSchema],
      default: [],
    },
    applicationProcess: {
      eyebrowLabel: {
        type: String,
        trim: true,
        default: "HOW IT WORKS",
      },
      heading: {
        type: String,
        trim: true,
        default: "Application Process",
      },
      steps: {
        type: [processStepSchema],
        default: [],
      },
    },
    futureOpportunities: {
      eyebrowLabel: {
        type: String,
        trim: true,
        default: "FUTURE OPPORTUNITIES",
      },
      heading: {
        type: String,
        trim: true,
        default: "Interested in future opportunities?",
      },
      description: {
        type: String,
        trim: true,
        default:
          "If a suitable role is not currently listed, you may submit a general expression of interest and we will review it with institutional care.",
      },
      buttonLabel: {
        type: String,
        trim: true,
        default: "CONTACT BLACKMONT",
      },
      buttonHref: {
        type: String,
        trim: true,
        default: "/contact",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Career", careerSchema);