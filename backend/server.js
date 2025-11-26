const connectDB = require("./shared/middlewares/connect-db");
//import dotenv and connectDB at top
require("dotenv").config();

const express = require("express");
const server = express();

const PORT = 3000;
const hostname = "localhost";

//add build-in middlewares to parse request body in application-level
server.use(express.json());
server.use(connectDB);
//add router
const moviesRouter = require("./modules/movies/movies-routes");
const usersRouter = require("./modules/users/users-routes");

server.use("/movies", moviesRouter);
server.use("/users", usersRouter);

//temporary route to fetch users
const { fetchMovies, fetchUsers } = require("./shared/file-utils");

server.get("/fetch-users", async (req, res) => {
  try {
    await fetchUsers();
    res.json({ message: "Users data fetched successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
