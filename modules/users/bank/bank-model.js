const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  cardExpire: { type: String },
  cardNumber: { type: String },
  cardType: { type: String },
  currency: { type: String },
  iban: { type: String },
});

const Bank = new mongoose.module("Bnak", bankSchema);

module.exports = Bank;
