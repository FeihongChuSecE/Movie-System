const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  department: { type: String },
  name: { type: String },
  title: { type: String },
  address: { type: ObjectId, ref: "Address" },
});
const Company = mongoose.module("Company", companySchema);

module.exports = Company;
