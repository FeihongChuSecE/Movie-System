const bcrypt = require("bcryptjs");

const encodePassword = (raw) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(raw, salt);
    return hash;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
};

const matchPassword = (raw, encoded) => {
  try {
    const isMatch = bcrypt.compareSync(raw, encoded);
    return isMatch;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
};

module.exports = { encodePassword, matchPassword };
