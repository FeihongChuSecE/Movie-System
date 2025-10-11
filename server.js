const express = require("express");
const app = express();

const API = "https://api.tvmaze.com/shows";

//Home page: navigation to other page
//get all movies
app.get("/movies", (req, res, next) => {
  res.send("Hello, welcome to your movie page");
});

//get a movie by id, name, cast
app.get("/movies/:id", (req, res, next) => {
  res.send("Hello, welcome to your movie page");
});

//add a movie
app.post("/movies", (req, res, next) => {
  res.send("Hey you watched a new movie");
});

//update data if the user want to change the rating
app.put("/movies/:id", (req, res, next) => {
  res.send("Hey you watched a new movie");
});

//delete a movie
app.delete("/movies/:id", (req, res, next) => {
  res.send("Hey you watched a new movie");
});

//starting the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server runing at http://localhost:${PORT}`);
});
