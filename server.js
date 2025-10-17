const express = require("express");
const server = express();

const PORT = 4000;
const hostname = "localhost";

//add build-in middlewares
server.use(express.json());
//add router
const router = require("./modules/movies/movies-routes");
server.use("/movies", router);

//add middleware error handling: must come after routes
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ err: "internal server error" });
});

// 404 handler: must come last
server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found`);
});

//starting the server
server.listen(PORT, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running at http://${hostname}:${PORT}`);
});
