const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  stateCode: { type: String },
  postalCode: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  country: { type: String },
});

const Address = new mongoose.module("Address", addressSchema);

module.exports = Address;
