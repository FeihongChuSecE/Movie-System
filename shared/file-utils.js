const fs = require("fs");

async function fetchFiles() {
  try {
    //fetch data from API
    const url = "https://api.tvmaze.com/shows";
    //fetch the data
    const response = await fetch(url);
    //json object
    const movieData = await response.json();
    //json string
    const movieJson = JSON.stringify(movieData, null, 2);
    //save the data to movie.json
    fs.writeFileSync("./data/movies.json", movieJson, "utf-8");
    console.log("Data saved to movies.json");
  } catch (error) {
    console.error(`Couldn't save data ${error.message}`);
  }
}
fetchMovies();

//read json file and parse
async function readFile(movieJson) {
  try {
    const file = fs.readFileSync(movieJson, "utf-8");
    return JSON.parse(movieJson);
  } catch (error) {
    throw new Error(`Couldn't read file ${error.message}`);
  }
}

//write file to movie.json
async function writeToFile(movieJson, update) {
  try {
    const data = JSON.stringify(update);
    fs.writeFileSync(movieJson, data, "utf-8");
  } catch (error) {
    throw new Error(`Couldn't write into file ${movieJson}`);
  }
}
module.exports = { fetchFiles, readFile };
