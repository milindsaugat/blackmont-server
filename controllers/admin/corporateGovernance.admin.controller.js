const CorporateGovernance = require("../../models/corporateGovernance.model");

const ensureDefaultDocument = async () => {
  let doc = await CorporateGovernance.findOne();
  if (!doc) {
    doc = new CorporateGovernance({
      pillars: [
        { number: "01", title: "Fiduciary Duty", description: "Absolute commitment to client capital preservation and alignment of interests.", order: 1, isActive: true },
        { number: "02", title: "Transparency", description: "Clear, timely, and honest reporting of all custody allocations and holdings.", order: 2, isActive: true }
      ]
    });
    await doc.save();
  }
  return doc;
};

const getGovernanceAdmin = async (req, res) => {
  try {
    let doc = await ensureDefaultDocument();
    
    // Sort pillars by order ascending
    doc.pillars.sort((a, b) => a.order - b.order);

    res.status(200).json({ success: true, message: "Corporate governance fetched successfully", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch corporate governance", error: error.message });
  }
};

const updateGovernanceAdmin = async (req, res) => {
  try {
    await ensureDefaultDocument();
    
    // We update the single existing document
    const updates = { ...req.body };
    // Prevent accidentally overwriting the pillars array directly from the main update route if not intended,
    // though the prompt says "PATCH main section should update only provided fields."
    delete updates.pillars;

    const doc = await CorporateGovernance.findOneAndUpdate({}, updates, { new: true });
    
    doc.pillars.sort((a, b) => a.order - b.order);

    res.status(200).json({ success: true, message: "Corporate governance updated successfully", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update corporate governance", error: error.message });
  }
};

const addPillar = async (req, res) => {
  try {
    const doc = await ensureDefaultDocument();

    if (doc.pillars.length >= 8) {
      return res.status(400).json({ success: false, message: "Maximum of 8 pillars allowed" });
    }

    const newPillar = {
      number: req.body.number || "",
      title: req.body.title || "",
      description: req.body.description || "",
      order: req.body.order !== undefined ? req.body.order : doc.pillars.length + 1,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    doc.pillars.push(newPillar);
    await doc.save();

    doc.pillars.sort((a, b) => a.order - b.order);

    res.status(201).json({ success: true, message: "Pillar added successfully", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add pillar", error: error.message });
  }
};

const updatePillar = async (req, res) => {
  try {
    const { pillarId } = req.params;
    const doc = await CorporateGovernance.findOne({ "pillars._id": pillarId });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Pillar not found" });
    }

    const pillar = doc.pillars.id(pillarId);
    if (req.body.number !== undefined) pillar.number = req.body.number;
    if (req.body.title !== undefined) pillar.title = req.body.title;
    if (req.body.description !== undefined) pillar.description = req.body.description;
    if (req.body.order !== undefined) pillar.order = req.body.order;
    if (req.body.isActive !== undefined) pillar.isActive = req.body.isActive;

    await doc.save();

    doc.pillars.sort((a, b) => a.order - b.order);

    res.status(200).json({ success: true, message: "Pillar updated successfully", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update pillar", error: error.message });
  }
};

const deletePillar = async (req, res) => {
  try {
    const { pillarId } = req.params;
    const doc = await CorporateGovernance.findOne({ "pillars._id": pillarId });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Pillar not found" });
    }

    doc.pillars.pull(pillarId);
    await doc.save();

    doc.pillars.sort((a, b) => a.order - b.order);

    res.status(200).json({ success: true, message: "Pillar deleted successfully", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete pillar", error: error.message });
  }
};

module.exports = {
  getGovernanceAdmin,
  updateGovernanceAdmin,
  addPillar,
  updatePillar,
  deletePillar
};
