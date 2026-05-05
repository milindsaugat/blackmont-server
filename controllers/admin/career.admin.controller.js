const Career = require("../../models/career.model");

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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseBoolean(value, defaultValue = true) {
  if (value === undefined) return defaultValue;
  return value === true || value === "true" || value === "1";
}

function parseOrder(value, defaultValue = 0) {
  if (value === undefined || value === "") return defaultValue;
  return parseInt(value, 10);
}

function sortCareerData(data) {
  if (data?.jobs) {
    data.jobs.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  if (data?.applicationProcess?.steps) {
    data.applicationProcess.steps.sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  }

  return data;
}

async function getOrCreateCareer() {
  let data = await Career.findOne();

  if (!data) {
    data = await Career.create(DEFAULT_CAREER);
  }

  return sortCareerData(data);
}

function assignFields(target, source, fields) {
  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      target[field] = source[field];
    }
  });
}

function normalizeCareerDoc(data) {
  const doc = data.toObject ? data.toObject() : data;

  doc.header = {
    heroEyebrow: doc.heroEyebrow || "",
    heroTitle: doc.heroTitle || "",
    heroDescription: doc.heroDescription || "",
  };

  doc.openPositions = {
    eyebrowLabel: doc.openPositions?.eyebrowLabel || "",
    heading: doc.openPositions?.heading || "",
    description: doc.openPositions?.description || "",
  };

  doc.applicationProcess = {
    sectionEyebrowLabel:
      doc.applicationProcess?.sectionEyebrowLabel ||
      doc.applicationProcess?.eyebrowLabel ||
      "",
    sectionHeading:
      doc.applicationProcess?.sectionHeading ||
      doc.applicationProcess?.heading ||
      "",
    steps: doc.applicationProcess?.steps || [],
  };

  doc.jobs = (doc.jobs || []).map((job) => ({
    ...job,
    applyNowLink: job.applyNowLink || job.applyLink || "",
    buttonLabel: job.buttonLabel || "Apply Now",
  }));

  return doc;
}

async function getCareerAdmin(req, res) {
  try {
    const data = await getOrCreateCareer();

    res.status(200).json({
      success: true,
      message: "Careers CMS fetched successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Careers CMS",
      error: error.message,
    });
  }
}

async function updateCareerHeader(req, res) {
  try {
    const data = await getOrCreateCareer();

    if (Object.prototype.hasOwnProperty.call(req.body, "heroEyebrow")) {
      data.heroEyebrow = req.body.heroEyebrow;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "heroTitle")) {
      data.heroTitle = req.body.heroTitle;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "heroDescription")) {
      data.heroDescription = req.body.heroDescription;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "eyebrowLabel")) {
      data.openPositions.eyebrowLabel = req.body.eyebrowLabel;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "heading")) {
      data.openPositions.heading = req.body.heading;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
      data.openPositions.description = req.body.description;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "sectionEyebrow")) {
      data.openPositions.eyebrowLabel = req.body.sectionEyebrow;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "sectionHeading")) {
      data.openPositions.heading = req.body.sectionHeading;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "sectionDescription")) {
      data.openPositions.description = req.body.sectionDescription;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "isActive")) {
      data.isActive = parseBoolean(req.body.isActive);
    }

    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Careers header updated successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Careers header",
      error: error.message,
    });
  }
}

async function addJob(req, res) {
  try {
    const { department, title, shortDescription } = req.body;

    if (!department || !title || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: "Department, title, and shortDescription are required",
        data: null,
      });
    }

    const data = await getOrCreateCareer();
    const jobSlug = req.body.slug ? slugify(req.body.slug) : slugify(title);

    data.jobs.push({
      department,
      title,
      slug: jobSlug,
      location: req.body.location || "",
      employmentType: req.body.employmentType || "",
      shortDescription,
      fullDescription: req.body.fullDescription || "",
      applyNowLink:
        req.body.applyNowLink || req.body.applyLink || `/careers/apply?role=${jobSlug}`,
      buttonLabel: req.body.buttonLabel || "Apply Now",
      isActive: parseBoolean(req.body.isActive),
      order: parseOrder(req.body.order, data.jobs.length + 1),
    });

    await data.save();
    sortCareerData(data);

    res.status(201).json({
      success: true,
      message: "Career job added successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add career job",
      error: error.message,
    });
  }
}

async function updateJob(req, res) {
  try {
    const { jobId } = req.params;
    const data = await getOrCreateCareer();
    const job = data.jobs.id(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Career job not found",
        data: null,
      });
    }

    assignFields(job, req.body, [
      "department",
      "title",
      "location",
      "employmentType",
      "shortDescription",
      "fullDescription",
      "applyNowLink",
      "buttonLabel",
    ]);

    if (
      Object.prototype.hasOwnProperty.call(req.body, "applyLink") &&
      !Object.prototype.hasOwnProperty.call(req.body, "applyNowLink")
    ) {
      job.applyNowLink = req.body.applyLink;
    }

    if (req.body.slug !== undefined && req.body.slug !== "") {
      job.slug = slugify(req.body.slug);
    } else if (!job.slug && job.title) {
      job.slug = slugify(job.title);
    }

    if (req.body.isActive !== undefined) {
      job.isActive = parseBoolean(req.body.isActive);
    }
    if (req.body.order !== undefined) {
      job.order = parseOrder(req.body.order);
    }

    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Career job updated successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update career job",
      error: error.message,
    });
  }
}

async function deleteJob(req, res) {
  try {
    const { jobId } = req.params;
    const data = await getOrCreateCareer();
    const job = data.jobs.id(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Career job not found",
        data: null,
      });
    }

    job.deleteOne();
    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Career job deleted successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete career job",
      error: error.message,
    });
  }
}

async function toggleJobStatus(req, res) {
  try {
    const { jobId } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive field is required",
        data: null,
      });
    }

    const data = await getOrCreateCareer();
    const job = data.jobs.id(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Career job not found",
        data: null,
      });
    }

    job.isActive = parseBoolean(isActive);

    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Career job status updated successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update career job status",
      error: error.message,
    });
  }
}

async function updateApplicationProcess(req, res) {
  try {
    const data = await getOrCreateCareer();

    if (Object.prototype.hasOwnProperty.call(req.body, "sectionEyebrowLabel")) {
      data.applicationProcess.eyebrowLabel = req.body.sectionEyebrowLabel;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "sectionHeading")) {
      data.applicationProcess.heading = req.body.sectionHeading;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "eyebrowLabel")) {
      data.applicationProcess.eyebrowLabel = req.body.eyebrowLabel;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "heading")) {
      data.applicationProcess.heading = req.body.heading;
    }

    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Application process updated successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update application process",
      error: error.message,
    });
  }
}

async function addProcessStep(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Process step title and description are required",
        data: null,
      });
    }

    const data = await getOrCreateCareer();

    data.applicationProcess.steps.push({
      number: req.body.number || "",
      title,
      description,
      order: parseOrder(
        req.body.order,
        data.applicationProcess.steps.length + 1
      ),
      isActive: parseBoolean(req.body.isActive),
    });

    await data.save();
    sortCareerData(data);

    res.status(201).json({
      success: true,
      message: "Application process step added successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add application process step",
      error: error.message,
    });
  }
}

async function updateProcessStep(req, res) {
  try {
    const { stepId } = req.params;
    const data = await getOrCreateCareer();
    const step = data.applicationProcess.steps.id(stepId);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Application process step not found",
        data: null,
      });
    }

    assignFields(step, req.body, ["number", "title", "description"]);

    if (req.body.order !== undefined) {
      step.order = parseOrder(req.body.order);
    }
    if (req.body.isActive !== undefined) {
      step.isActive = parseBoolean(req.body.isActive);
    }

    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Application process step updated successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update application process step",
      error: error.message,
    });
  }
}

async function deleteProcessStep(req, res) {
  try {
    const { stepId } = req.params;
    const data = await getOrCreateCareer();
    const step = data.applicationProcess.steps.id(stepId);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Application process step not found",
        data: null,
      });
    }

    step.deleteOne();
    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Application process step deleted successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete application process step",
      error: error.message,
    });
  }
}

async function updateFutureOpportunities(req, res) {
  try {
    const data = await getOrCreateCareer();

    assignFields(data.futureOpportunities, req.body, [
      "eyebrowLabel",
      "heading",
      "description",
      "buttonLabel",
      "buttonHref",
    ]);

    await data.save();
    sortCareerData(data);

    res.status(200).json({
      success: true,
      message: "Future opportunities updated successfully",
      data: normalizeCareerDoc(data),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update future opportunities",
      error: error.message,
    });
  }
}

module.exports = {
  getCareerAdmin,
  updateCareerHeader,
  addJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  updateApplicationProcess,
  addProcessStep,
  updateProcessStep,
  deleteProcessStep,
  updateFutureOpportunities,
};