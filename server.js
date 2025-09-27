const express = require("express");
const app = express();
const PORT = 4000;

//router
app.get("/", (req, res, next) => {
  res.send("Hello, welcome to your movie rescored");
})

app.listen(PORT, () => {
  console.log(`Server runing at http://localhost:${PORT}`);
})
