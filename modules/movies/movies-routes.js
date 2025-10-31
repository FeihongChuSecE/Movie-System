const express = require("express");
const router = express.Router();

//get /movies information from movie-model

const {
  getAllMovies,
  getMovieByID,
  addNewMovie,
  updateExistingMovie,
  deleteMovie,
  MovieModel,
} = require("./movies-model");
const { createMovieRules } = require("./middlewares/create-movie-rules");
const { updateMovieRules } = require("./middlewares/update-movie-rules");

//add middleware
const checkValidation = require("../../shared/middlewares/check-validation");
const { check } = require("express-validator");

//./movies?name=....check the movie exists, not exist, create a new movie
router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    //check name in db
    if (name) {
      //search movie by name
      let movie = await MovieModel.findOne({
        name: { $regex: name, $options: "i" },
      });
      if (movie) {
        //movie exist
        return res
          .status(200)
          .json({ message: `The movie ${name} exists`, movie: movie });
      } else {
        //movie not exist, create a new movie
        movie = await MovieModel.create({ name });
        return res
          .status(200)
          .json({ message: `The movie ${name} is created` });
      }
      //movie not exist
    } else {
      const movies = await MovieModel.find({});
      return res.status(200).json(movies);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// get / get movie details by name
router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    const movies = await MovieModel.find({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!movies || movies.length === 0) {
      return res.json([]);
    }
    movies = await MovieModel.find({});
    if (!movies || movies.length === 0) {
      return res.json([]);
    }
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get /:id?search={name}&page=2&limit=10 get movies by id
router.get("/:id", async (req, res, next) => {
  try {
    //search with default value
    const search = req.query.search || "";
    const movieID = req.params.id;
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { id: movieID },
        { name: { $regex: `^${search}`, $options: "i" } },
        { summary: { $regex: `^${search}`, $options: "i" } },
      ],
    };

    const movies = await MovieModel.find(query)
      .sort({ premiered: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    //error
    if (!movies) {
      return res.status(404).json({ message: "movie not found" });
    }
    //success return the sigle movie
    res.json({
      movies,
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//post /movies add a new movie
router.post("/", createMovieRules, checkValidation, async (req, res, next) => {
  try {
    const newMovie = await MovieModel.create(req.body);
    res.status(201).json(newMovie); //return new movie
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// put movies/:id update a signal movie that match a filter
router.put(
  "/:id",
  updateMovieRules,
  checkValidation,
  async (req, res, next) => {
    try {
      //check movie exists
      const movieID = req.params.id;
      const movie = await MovieModel.findOne(movieID);
      if (!movie) {
        return res.status(404).json({ message: "movie not found" });
      }
      //update movie
      const updatedMovie = await MovieModel.findByIdAndUpdate(
        movieID,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//delete /movies/:id delete a movie by id
router.delete("/:id", async (req, res, next) => {
  try {
    const movieID = req.params.id;
    const movie = await MovieModel.findById(movieID);
    if (!movie) {
      return res.status(404).json({ message: "movie not found" });
    }
    //movie not delete
    const deletedMovie = await MovieModel.findByIdAndDelete(movieID);
    if (!deletedMovie) {
      return res.status(404).json({ message: "movie not deleted" });
    }

    res.json({ message: "Movie deleted successfully", deletedMovie }); //return deleted movie
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
