import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcryptjs";
import Organization from "./models/Organization.js";

dotenv.config();

const organizations = JSON.parse(
  fs.readFileSync("./data/organizations.json", "utf-8")
);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Organization.deleteMany();
    console.log("🧹 Old data removed");

    const orgsWithHashedPasswords = await Promise.all(
      organizations.map(async (org) => ({
        ...org,
        password: await bcrypt.hash(org.password, 10),
        updates: [],
      }))
    );

    await Organization.insertMany(orgsWithHashedPasswords);
    console.log("🌱 Data successfully seeded!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();