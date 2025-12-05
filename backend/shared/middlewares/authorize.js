const { request } = require("express");
const { decodeToken } = require("../jwt-utils");

const authError = {
  EN: "You don't have permission to access this resource",
  FR: "Vous n'êtes pas autorisé à accéder à cette ressource.",
};

function authorize(req, res, next) {
  const authHeader = req.get("Authorization");
  //read lang cookie
  const lang = req.cookies.lang || "EN";
  if (!authHeader) {
    return res.status(401).json({ message: authError[lang] });
  }
  const decoded = decodeToken(authHeader);
  if (!decoded) {
    return res.status(401).json({ message: authError[lang] });
  }
  req.user = decoded;
  next();
}

module.exports = authorize;
