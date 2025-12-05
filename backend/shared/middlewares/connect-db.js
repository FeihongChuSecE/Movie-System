//MongoDB connection middleware
const mongoose = require("mongoose");
require("dotenv").config();

const DEFAULT_URI = "mongodb://localhost:27017/movieSystemDB";
const dbUrl = process.env.DB_URL || process.env.MONGODB_URI || DEFAULT_URI;
const DB_NAME = process.env.DB_NAME || "movieSystemDB";

let isConnected = false;

async function connectDB(req, res, next) {
  try {
    if (isConnected) return next();

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME,
    });

    isConnected = true;
    console.log(`Database connected to ${dbUrl}/${DB_NAME}`);
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Allow request to continue; downstream may handle via fallback
    next();
  }
}

module.exports = connectDB;
