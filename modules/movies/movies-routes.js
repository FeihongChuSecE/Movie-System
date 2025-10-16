const express = require("express");
const router = express.Router();

//get /movies information from movie-model
const { getAllMovies } = require("./movies.model");
const {
  getAllMovies,
  getMovieByID,
  addNewMovie,
  updateExistingMovie,
  deleteMovie,
} = require("./movies-model");
const { createMovieRules } = require("./middlewares/create-movie-rules");
const { updateMovieRules } = require("./middlewares/update-movie-rules");

//add middleware
const { validationResult } = require("express-validator");

//get all movies
router.get("/movies", async (req, res, next) => {
  try {
    //all products data
    const movies = await getAllMovies();
    //no movie exist
    if (!movies || movies.length === 0) {
      return res.json([]);
    }

    res.json(movies); //return all movies
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get /mpvies/:id get a sigle movie by id
router.get("/movies/:id", async (req, res, next) => {
  try {
    //get all the id
    const movieID = req.params.id;
    const movie = await getMovieByID(movieID);
    //error
    if (!movie) {
      return res.status(404).json({ message: "movie not found" });
    }
    //success return the sigle movie
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//post /movies add a new movie
router.post("/movies", createMovieRules, async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ error: result.array() });
    }

    const newMovie = await addNewMovie(req.body);
    res.json(newMovie); //return new movie
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//put /movies/:id update existing movie
router.put("/movies/:id", updateMovieRules, async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ error: result.array() });
    }
    //fatch data by id
    const movieID = req.params.id;
    const movie = await getMovieByID(movieID);
    if (!movie) {
      return res.status(404).json({ message: "movie not found" });
    }

    const updatedMovie = await updateExistingMovie(movieID, req.body);

    if (movie.isExist()) {
      return res.json(updatedMovie); //return updated movie
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete /movies/:id delete a movie by id
router.delete("/movies/:id", async (req, res, next) => {
  try {
    const movieID = req.params.id;
    const movie = await getMovieByID(movieID);
    if (!movie) {
      return res.status(404).json({ message: "movie not found" });
    }
    //movie not delete
    const deletedMovie = await deleteMovie(movieID);
    if (movie.isExist()) {
      return res.status(404).json({ message: "movie is not deleted" });
    }

    res.json(deletedMovie); //return deleted movie
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
