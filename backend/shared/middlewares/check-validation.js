const { validationResult } = require("express-validator");

//middleware to check validation error
function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      error: errors.array(),
    });
  }
  next();
}
module.exports = checkValidation;
