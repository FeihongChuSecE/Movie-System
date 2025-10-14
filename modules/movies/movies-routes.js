const express = require("express");
const router = express.Router();

//get /movies
const { getAllMovies } = require("./moviews.model");
const { getMovieByID } = require("./movies-model");

router.get("./movies", async (req, res, next) => {
  try {
    //all products data
    const movies = await getAllMovies();
    //no movie exist
    if (movies.length === 0) {
      return res.json([]);
    }

    res.json(movies);
  } catch (error) {
    res.status(404).json({ message: "No movies exist" });
  }
});

//get /mpvies/:id
router.get("./movies", async (req, res, next) => {
  try {
    //get all the id
    const movieID = req.params.id;
    const movie = await getMovieByID(movieID);
    //error
    if (!movie) {
      return res.status(404).json({ message: "movie not found" });
    }
    //success
    res.json(movie);
  } catch (error) {
    res.status(404).json({ message: "No movies exist" });
  }
});

//post /movies
const { addNewMovies } = require("./movies-model");
const { validationResult } = require("express-validator");
const { createMovieRules } = require("./middlewares/create-movie-rules");

router.post("./movies", async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ error: result.array() });
    }

    const newMovie = await addNewMovies(req.body);
    res.json(newMovie);
  } catch (error) {
    res.status(404).json({ message: "No movies exist" });
  }
});

//put /movies/:id
router.put("./movies", async (req, res, next) => {
  try {
  } catch (error) {
    res.status(404).json({ message: "No movies exist" });
  }
});

//delete /movies/:id
router.delete("./movies", async (req, res, next) => {
  try {
  } catch (error) {
    res.status(404).json({ message: "No movies exist" });
  }
});
