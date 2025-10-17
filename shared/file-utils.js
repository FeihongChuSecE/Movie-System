const fs = require("fs");

async function fetchFiles() {
  try {
    //fetch data from API
    const url = "https://api.tvmaze.com/shows";
    const response = await fetch(url); //fetch the data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movieData = await response.json(); //json object

    //save the data to movie.json
    const movieJson = JSON.stringify(movieData, null, 2); //json string
    fs.writeFileSync("./data/movies.json", movieJson, "utf-8");
    console.log("Data saved to movies.json");
  } catch (error) {
    console.error(`Couldn't save data ${error.message}`);
  }
}

//read json file and parse
async function readFile(movieData) {
  try {
    const file = fs.readFileSync(movieData, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    throw new Error(`Couldn't read file ${error.message}`);
  }
}

//write file to movie.json
async function writeToFile(movieData, update) {
  try {
    const data = JSON.stringify(update, null, 2);
    fs.writeFileSync(movieData, data, "utf-8");
  } catch (error) {
    throw new Error(`Couldn't write into file ${movieJson}`);
  }
}

module.exports = { fetchFiles, readFile, writeToFile };
