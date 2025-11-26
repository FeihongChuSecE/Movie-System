const fs = require("fs");

async function fetchMovies() {
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

async function fetchUsers() {
  try {
    //fetch data from API
    const url = "https://dummyjson.com/users";
    const response = await fetch(url); //fetch the data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json(); //json object

    //save the data to users.json
    const userJson = JSON.stringify(userData.users, null, 2); //json string
    fs.writeFileSync("./data/users.json", userJson, "utf-8");
    console.log("Data saved to users.json");
  } catch (error) {
    console.error(`Couldn't save data ${error.message}`);
  }
}

//read json file and parse
async function readFile(filePath) {
  try {
    const file = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    throw new Error(`Couldn't read file ${error.message}`);
  }
}

//write file to movie.json
async function writeToFile(filePath, update) {
  try {
    const data = JSON.stringify(update, null, 2);
    fs.writeFileSync(filePath, data, "utf-8");
  } catch (error) {
    throw new Error(`Couldn't write into file ${filePath}: ${error.message}`);
  }
}

module.exports = { fetchMovies, fetchUsers, readFile, writeToFile };
