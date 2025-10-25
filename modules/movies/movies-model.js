const { readFile, writeToFile } = require("../../shared/file-utils");
const path = require("path");

const filePath = path.join(__dirname, "../../data/movies.json");

//get all movies from movies.json
async function getAllMovies() {
  try {
    const movies = await readFile(filePath);
    return movies;
  } catch (error) {
    console.error("Error reading movies file: ", error.message);
    return [];
  }
}

//get single movie by id
async function getMovieByID(movieID) {
  if (!movieID)
    throw new Error(`Cannot use ${movieID} to get movie information`);

  const allMovies = await getAllMovies();
  //convert id to number because JSON id is number
  const foundMovie = allMovies.find((movie) => movie.id === Number(movieID));
  return foundMovie;
}

//add a new movie by id
async function addNewMovie(newMovie) {
  if (!newMovie) {
    throw new Error(`Cannot use ${newMovie} to add a new movie`);
  }
  const allMovies = await getAllMovies();
  //create a new movie id
  newMovie = { id: allMovies.length + 1, ...newMovie };
  //push the new id to the old one
  allMovies.push(newMovie);
  //return the all the movie+new movie
  await writeToFile(filePath, allMovies);
  return newMovie;
}

//update an existing movie
async function updateExistingMovie(movieID, newMovie) {
  if (!movieID || !newMovie) {
    throw new Error(
      `Cannot use ${movieID} & ${newMovie}to update the existing movie`
    );
  }
  //read all the movies
  const allMovies = await getAllMovies();
  //check the exist movie
  const index = allMovies.findIndex((movie) => movie.id === Number(movieID));
  if (index < 0) {
    throw new Error(`Movie with ${movieID} doesn't exist`);
  }
  //update
  const updatedMovie = {
    ...allMovies[index],
    ...newMovie,
    id: allMovies[index].id,
  };
  allMovies[index] = updatedMovie;
  await writeToFile(filePath, allMovies);
  return updatedMovie;
}

//delete a movie by id
async function deleteMovie(movieID) {
  if (!movieID) {
    throw new Error(`Cannot use ${movieID} to delete movie`);
  }
  //read
  const allMovies = await getAllMovies();
  //check
  const index = allMovies.findIndex((movie) => movie.id === Number(movieID));
  if (index < 0) {
    throw new Error(`Movie with ${movieID} doesn't exist`);
  }
  //delete
  const [deletedMovie] = allMovies.splice(index, 1);
  await writeToFile(filePath, allMovies);
  return deletedMovie;
}

//create mongoose
const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  url: { type: String },
  name: { type: String, required: true },
  type: { type: String },
  language: { type: String },
  genres: [String],
  status: { type: String },
  runtime: { type: Number },
  premiered: { type: String },
  officialSite: { type: String },
  rating: {
    average: { type: Number },
  },
  weight: { type: Number },
  webChannel: { type: String, default: null },
  summary: { type: String },
});

const MovieModel = new mongoose.model("Movie", movieSchema, "movies");

module.exports = {
  getAllMovies,
  getMovieByID,
  addNewMovie,
  updateExistingMovie,
  deleteMovie,
  MovieModel,
};
