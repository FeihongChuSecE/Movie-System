const JWT = require("jsonwebtoken");
const decodeToken = (token) => {
  if (!token) {
    throw new Error("Koken not provided");
  }

  const splitsToken = token.split(" ")[1];
  try {
    const decodeToken = JWT.verify(splitsToken, process.env.TOKEN_SECRET);
    return decodeToken;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return undefined;
  }
};

const encodeToken = (payload) => {
  const secret = process.env.TOKEN_SECRET || "your-secret-key-here";
  return JWT.sign(payload, secret, { expiresIn: "1d" });
};

module.exports = { decodeToken, encodeToken };
