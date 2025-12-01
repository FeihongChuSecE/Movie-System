const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema({
  id: { type: Number, required: ture },
  name: { type: String, required: true },
  country: {
    name: { type: String },
    code: { type: String },
    timezone: { type: String },
  },
  officialSite: { type: String },
});

const Network = mongoose.module("Network", networkSchema);

module.exports = Network;
