const { body } = require("express-validator");

const createMovieRules = [
  body("url").exists().withMessage("Movie url is required"),
  body("name").exists(),
  body("type").exists(),
  body("language").exists(),
  body("genres").exists(),
  body("status").exists(),
  body("runtime").exists(),
  body("averageRuntime").exists(),
  body("premiered").exists(),
  body("ended").exists(),
  body("officialSite").exists(),
  body("schedule").exists(),
  body("rating").exists(),
  body("weight").exists(),
  body("network").exists(),
  body("webChannel").exists(),
  body("dvdCountry").exists(),
  body("externals").exists(),
  body("image").exists(),
  body("summary").exists(),
  body("_links").exists(),
];

module.exports = { createMovieRules };
