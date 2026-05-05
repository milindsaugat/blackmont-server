const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Admin = require("./models/admin.model");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const existingAdmin = await Admin.findOne({
      email: "admin@blackmont.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      name: "Blackmont Admin",
      email: "admin@blackmont.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit();
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });