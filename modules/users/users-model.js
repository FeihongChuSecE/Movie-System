const { readFile, writeToFile } = require("../../shared/file-utils");
const path = require("path");

const filePath = path.join(__dirname, "../../data/users.json");

//get all users from users.json
async function getAllUsers() {
  try {
    const users = await readFile(filePath);
    return users;
  } catch (error) {
    console.error("Error reading users file: ", error.message);
    return [];
  }
}

//get single user by id
async function getUserByID(userID) {
  if (!userID) throw new Error(`Cannot use ${userID} to get movie information`);

  const allUsers = await getAllUsers();
  //convert id to number because JSON id is number
  const foundUser = allUsers.find((user) => user.id === Number(userID));
  return foundUser;
}

module.exports = { getAllUsers, getUserByID };
