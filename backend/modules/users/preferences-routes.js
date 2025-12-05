const { Router } = require("express");

const preferencesRoute = Router();

preferencesRoute.get("/pref/toggle-language", async (req, res) => {
  const lang = req.cookies.lang || "EN";
  const switchLang = lang === "EN" ? "FR" : "EN";
  res.cookie("lang", switchLang),
    {
      heepOnly: true,
      secure: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
    };
  res.json({
    message: `Language switch to ${switchLang}`,
    lang: switchLang,
  });
});

module.exports = { preferencesRoute };
