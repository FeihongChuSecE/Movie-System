const { fetchFiles, readFile } = require("../../shared/file-utils");

const filePath = "./data/movies.json";
//get all movies from movies.json
async function getAllMovies() {
  return readFile(filePath);
}

//get single product by id
async function getMovieByID(movieID) {
  if (!movieID)
    throw new Error(`Cannot use ${movieID} to get movie information`);
  const allMovies = await getAllMovies();
  const foundMovie = allMovies.find((movie) => movie.id === Number(movieID));
  return foundMovie;
}

//add a new movie by id
async function addNewMovie(newMovie) {
  if (!newMovie) {
    throw new Error(`Cannot use ${newMovie} to add a new movie`);
  }
  const allMovies = await getAllMovies();
  newMovie = { id: allMovies.length + 1, ...newMovie };
  allMovies.push(newMovie);
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
  const index = allMovies.findIndex((movie) => movie.id === movieID);
  if (index < 0) throw new Error(`Movie with ${movieID} doesn't exist`);
  //update
  const updatedMovie = { ...allMovies[index], ...newMovie };
  allMovies[index] = updatedMovie;
  await writeToFile(filePath, allMovies);
  return updatedMovie;
}

//delete a movie by id
async function deleteMovie(movieID) {
  if (!movieID) throw new Error(`Cannot use ${movieID} to delete movie`);
  //read
  const allMovies = await getAllMovies();
  //check
  const index = allMovies.findIndex((movie) => movie.id === movieID);
  if (index < 0) throw new Error(`Movie with ${movieID} doesn't exist`);
  //delete
  const [deletedMovie] = allMovies.splice(index, 1);
  await writeToFile(filePath, allMovies);
  return deletedMovie;
}

module.exports = {
  getAllMovies,
  getMovieByID,
  addNewMovie,
  updateExistingMovie,
  deleteMovie,
};
