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
  body("language")
    .optional()
    .isString()
    .withMessage("language must be a string"),
  body("genres").optional().isArray().withMessage("Genres must be an array"),
  body("status").optional().isString().withMessage("Status must be a string"),
  body("runtime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Runtime must be a positive integer"),
  body("averageRuntime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("AverageRuntime must be a positive integer"),
  body("premiered")
    .optional()
    .isISO8601()
    .withMessage("Premiered date format must be yyyy-mm-dd"),
  body("ended")
    .optional()
    .isISO8601()
    .withMessage("Premiered date format must be yyyy-mm-dd"),
  body("officialSite")
    .optional()
    .isURL()
    .withMessage("Official site must be a valid URL"),
  body("schedule")
    .optional()
    .isObject()
    .withMessage("Schedule must be an object"),
  body("rating").optional().isObject().withMessage("Rating must be an object"),
  body("weight")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Weight must be a positive integer"),
  body("network")
    .optional()
    .isObject()
    .withMessage("Network must be an object"),
  body("webChannel")
    .optional({ nullable: true })
    .isObject()
    .withMessage("Web Channel must be an object"),
  body("image")
    .optional({ nullable: true })
    .isObject()
    .withMessage("Image must be an object"),
  body("summary").optional().isString().withMessage("Summary must be a string"),
];

module.exports = { createMovieRules };
