const mongoose = require("mongoose");
//store the dbUrl in .env
const dbUrl = process.env.DB_URL;

console.log(dbUrl);

// middleware to connect to mongoDB
async function connectDB(req, res, next) {
  try {
    await mongoose.connect(dbUrl, { dbName: "MovieSystemDB" });
    console.log("Database connected!");
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Database connection failed!");
  }
}

module.exports = connectDB;
