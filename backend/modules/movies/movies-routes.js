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
const authorize = require("../../shared/middlewares/authorize");
const { check } = require("express-validator");

//./movies?name=....check the movie exists, not exist, create a new movie
router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    // Always try Mongo first
    let movies = await MovieModel.find({});

    // Seed Mongo from file if empty
    if (movies.length === 0) {
      const fileMovies = await getAllMovies();
      if (fileMovies.length) {
        const toInsert = fileMovies.map((m, idx) => {
          const img =
            m.image && typeof m.image === "object"
              ? m.image.medium || m.image.original || m.image.url
              : typeof m.image === "string"
              ? m.image
              : undefined;
          return {
            id: m.id || idx + 1,
            name: m.name,
            type: m.type,
            language: m.language,
            genres: m.genres || [],
            status: m.status,
            runtime: m.runtime,
            premiered: m.premiered,
            ended: m.ended,
            officialSite: m.officialSite,
            summary: m.summary,
            image: { medium: img || "https://via.placeholder.com/300x200?text=No+Image" },
          };
        });
        await MovieModel.insertMany(toInsert);
        movies = await MovieModel.find({});
      }
    }

    // Search by name
    if (name) {
      let movie =
        movies.find((m) =>
          m.name.toLowerCase().includes(name.toLowerCase())
        ) ||
        (await MovieModel.findOne({ name: { $regex: name, $options: "i" } }));

      if (movie) {
        const obj = movie.toObject ? movie.toObject() : movie;
        const img = obj.image;
        return res.status(200).json({
          message: `The movie ${name} exists`,
          movie: {
            ...obj,
            image: {
              medium:
                (img && typeof img === "object" && (img.medium || img.original)) ||
                (typeof img === "string" ? img : "https://via.placeholder.com/300x200?text=No+Image"),
            },
          },
        });
      }

      // Create minimal movie in Mongo
      const count = await MovieModel.countDocuments();
      const newMovie = await MovieModel.create({
        id: count + 1,
        name,
        type: "Scripted",
        image: { medium: "https://via.placeholder.com/300x200?text=No+Image" },
      });
      return res
        .status(200)
        .json({ message: `The movie ${name} is created`, movie: newMovie });
    }

    // Normalize all movies
    const normalized = movies.map((m) => {
      const obj = m.toObject ? m.toObject() : m;
      const img = obj.image;
      return {
        ...obj,
        image: {
          medium:
            (img && typeof img === "object" && (img.medium || img.original)) ||
            (typeof img === "string" ? img : "https://via.placeholder.com/300x200?text=No+Image"),
        },
      };
    });

    return res.status(200).json(normalized);
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
router.post("/", authorize, createMovieRules, checkValidation, async (req, res, next) => {
  try {
    // Normalize image before saving
    const movieData = {
      ...req.body,
      image: req.body.image
        ? typeof req.body.image === "string"
          ? { medium: req.body.image }
          : req.body.image
        : { medium: "https://via.placeholder.com/300x200?text=No+Image" },
    };

    // Generate sequential id using max of Mongo and file data
    const mongoMax = await MovieModel.find({})
      .sort({ id: -1 })
      .limit(1)
      .then((docs) => (docs[0]?.id ? Number(docs[0].id) : 0));
    const fileMovies = await getAllMovies();
    const fileMax = fileMovies.reduce((max, m) => Math.max(max, m.id || 0), 0);
    const nextId = Math.max(mongoMax, fileMax) + 1;
    movieData.id = nextId;

    const newMovie = await MovieModel.create(movieData);
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Create movie error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// put movies/:id update a signal movie that match a filter
router.put(
  "/:id",
  authorize,
  updateMovieRules,
  checkValidation,
  async (req, res, next) => {
    try {
      //check movie exists
      const movieID = req.params.id;
      const movie = await MovieModel.findById(movieID);
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
router.delete("/:id", authorize, async (req, res, next) => {
  try {
    const movieID = Number(req.params.id);
    const deletedMovie = await MovieModel.findOneAndDelete({ id: movieID });
    if (!deletedMovie) {
      return res.status(404).json({ message: "movie not found" });
    }
    res.json({ message: "Movie deleted successfully", deletedMovie });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
