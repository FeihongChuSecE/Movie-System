const { body } = require("express-validator");

const createUserRules = [
  body("firstName").notEmpty().withMessage("First name is required").isString(),
  body("lastName").notEmpty().withMessage("Last name is required").isString(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone").notEmpty().withMessage("Phone is required").isString(),
  body("username").notEmpty().withMessage("Username is required").isString(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("age")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Age must be a positive number"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("image").optional().isURL().withMessage("Image must be a valid URL"),
  body("address")
    .optional()
    .isObject()
    .withMessage("Address must be an object"),
  body("address.address").optional().isString(),
  body("address.city").optional().isString(),
  body("address.country").optional().isString(),
];
module.exports = { createUserRules };
