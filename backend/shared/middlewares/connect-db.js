//MongoDB connection middleware
const mongoose = require("mongoose");
require("dotenv").config();
//store the dbUrl in .env
const dbUrl = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

console.log(dbUrl);

// middleware to connect to mongoDB
async function connectDB(req, res, next) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "movieSystemDB",
    });
    console.log("Database connected!");
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Database connection failed!");
  }
}

module.exports = connectDB;
