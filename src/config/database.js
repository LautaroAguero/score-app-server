import mongoose from "mongoose";
import { environment } from "./environment.js";

export async function connectDB() {
  try {
    const uri = environment.DB_URI;
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
