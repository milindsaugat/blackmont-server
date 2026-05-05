const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Admin = require("./models/admin.model");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("blackmont2026", 10);

    const result = await Admin.findOneAndUpdate(
      { email: "admin@blackmont.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (result) {
      console.log("Admin password updated successfully");
    } else {
      // No admin exists, create one
      await Admin.create({
        name: "Blackmont Admin",
        email: "admin@blackmont.com",
        password: hashedPassword,
      });
      console.log("Admin created with new password");
    }
    process.exit();
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });