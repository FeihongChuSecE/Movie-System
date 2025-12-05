const { body } = require("express-validator");

const createMovieRules = [
  body("name")
    .exists()
    .withMessage("Movie name is required")
    .isString()
    .withMessage("Movie name must be a string")
    .notEmpty()
    .withMessage("Movie name cannot be empty"),
  
  body("type").optional().isString().withMessage("Type must be a string"),
  body("language").optional().isString().withMessage("Language must be a string"),
  body("genres").optional().isArray().withMessage("Genres must be an array"),
  body("status").optional().isString().withMessage("Status must be a string"),
  body("runtime").optional().isInt({ min: 0 }).withMessage("Runtime must be a positive integer"),
  body("premiered").optional().isString().withMessage("Premiered must be a string"), 
  body("ended").optional().isString().withMessage("Ended must be a string"),  
  body("officialSite").optional().isURL().withMessage("Official site must be a valid URL"),
  body("summary").optional().isString().withMessage("Summary must be a string"),
  body("image").optional().isObject().withMessage("Image must be an object"),  // Allow simple { medium: "url" }
];

module.exports = { createMovieRules };