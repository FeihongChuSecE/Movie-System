const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  medium: { type: String },
  original: { type: String },
});

const Image = mongoose.module("Image", imageSchema);

module.exports = Image;
