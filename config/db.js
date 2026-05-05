const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Please ensure MONGO_URI is set and your IP is whitelisted in MongoDB Atlas.");
    // In production/deployment, we don't want to exit the process as it causes 500 boot errors.
    // Instead, we let the app stay up so the health checks/root route can still work.
  }
};

module.exports = connectDB;