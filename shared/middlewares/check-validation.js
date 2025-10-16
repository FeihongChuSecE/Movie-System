const { validationResult } = require("express-validator");

//middleware to check validation error
function checkValidation(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  next();
}
module.exports = checkValidation;
