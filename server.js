const express = require("express");
const server = express();

const PORT = 4000;
const hostname = "localhost";

//add build-in middlewares
server.use(express.json());
const router = express.Router();

//add routes
const { getAllMovies } = require(".movies/movie-model");
router.route("/").get(getAllMovies);
server.use("/modules/movies", router);

//add middleware error handling
server.use((err, req, res, next) => {
  res.status(500).json({ err: "internal server error" });
});

server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found`);
});
//starting the server
server.listen(PORT, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server runing at http://${localhost}:${PORT}`);
});
