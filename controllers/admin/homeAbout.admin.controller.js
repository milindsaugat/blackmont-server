const mongoose = require("mongoose");
const HomeAbout = require("../../models/homeAbout.model");
const fs = require("fs");
const path = require("path");

// Ensure single document exists
const getOrCreateHomeAbout = async () => {
  let data = await HomeAbout.findOne();

  if (!data) {
    data = await HomeAbout.create({
      title: "About Blackmont",
      description:
        "A modern precious metals enterprise built on disciplined stewardship, institutional clarity, and long-term client alignment.",
      images: [],
      cards: [],
      isActive: true,
    });
  }

  return data;
};

// GET
const getAdminHomeAbout = async (req, res) => {
  try {
    const data = await getOrCreateHomeAbout();

    res.status(200).json({
      success: true,
      message: "Home about fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home about",
      error: error.message,
    });
  }
};

// Helpers
const cleanString = (value) =>
  typeof value === "string" ? value.trim() : "";

const saveBase64Image = (base64Image) => {
  if (!base64Image || !base64Image.startsWith("data:image")) {
    return base64Image;
  }

  const matches = base64Image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches) return base64Image;

  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const base64Data = matches[2];

  const uploadDir = path.join(__dirname, "../../uploads/home-about");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `home-about-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, base64Data, "base64");

  return `/uploads/home-about/${fileName}`;
};

// Normalize Images
const normalizeImages = (images) => {
  if (!Array.isArray(images)) return undefined;

  return images
    .map((image) => {
      const rawImageUrl = cleanString(image?.imageUrl);

      if (!rawImageUrl) return null;

      const imageUrl = saveBase64Image(rawImageUrl);

      const normalized = {
        imageUrl,
        altText: cleanString(image?.altText),
      };

      if (mongoose.Types.ObjectId.isValid(image?._id)) {
        normalized._id = image._id;
      }

      return normalized;
    })
    .filter(Boolean);
};

// ✅ FIXED NORMALIZE CARDS (MAIN BUG FIX)
const normalizeCards = (cards) => {
  if (!Array.isArray(cards)) return undefined;

  return cards
    .map((card) => {
      const title = cleanString(card?.title);
      const description = cleanString(card?.description);

      // ✅ FIX: BOTH REQUIRED
      if (!title || !description) return null;

      const normalized = {
        title,
        description,
      };

      if (mongoose.Types.ObjectId.isValid(card?._id)) {
        normalized._id = card._id;
      }

      return normalized;
    })
    .filter(Boolean);
};

// PATCH (update full section)
const updateHomeAbout = async (req, res) => {
  try {
    const { title, description, isActive, images, cards } = req.body;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const normalizedImages = normalizeImages(images);
    const normalizedCards = normalizeCards(cards);

    if (normalizedImages !== undefined) updateData.images = normalizedImages;
    if (normalizedCards !== undefined) updateData.cards = normalizedCards;

    const data = await HomeAbout.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "HomeAboutPreview updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error); // 🔥 important for debugging

    res.status(500).json({
      success: false,
      message: "Failed to update home about",
      error: error.message,
    });
  }
};

// ADD IMAGE
const addHomeAboutImage = async (req, res) => {
  try {
    const { imageUrl, altText } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "imageUrl is required",
      });
    }

    const data = await HomeAbout.findOneAndUpdate(
      {},
      {
        $push: {
          images: {
            imageUrl,
            altText: altText || "",
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Image added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add image",
      error: error.message,
    });
  }
};

// DELETE IMAGE
const deleteHomeAboutImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const data = await HomeAbout.findOneAndUpdate(
      {},
      {
        $pull: {
          images: { _id: imageId },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

// ADD CARD
const addHomeAboutCard = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description required",
      });
    }

    const data = await HomeAbout.findOneAndUpdate(
      {},
      {
        $push: {
          cards: { title, description },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Card added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add card",
      error: error.message,
    });
  }
};

// DELETE CARD
const deleteHomeAboutCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const data = await HomeAbout.findOneAndUpdate(
      {},
      {
        $pull: {
          cards: { _id: cardId },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete card",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminHomeAbout,
  updateHomeAbout,
  addHomeAboutImage,
  deleteHomeAboutImage,
  addHomeAboutCard,
  deleteHomeAboutCard,
};