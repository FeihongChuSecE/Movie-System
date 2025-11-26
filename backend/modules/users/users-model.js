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

//add a new user by id
async function addNewUser(newUser) {
  if (!newUser) {
    throw new Error(`Cannot use ${newUser} to add a new user`);
  }
  const allUsers = await getAllUsers();
  //create a new user id
  newUser = { id: allUsers.length + 1, ...newUser };
  //push the new id to the old one
  allUsers.push(newUser);
  //return the all the user+new user
  await writeToFile(filePath, allUsers);
  return newUser;
}

const mongoose = require("mongoose");
const { Network } = require("inspector/promises");
const userSchema = new mongoose.Schema({
  id: {
    typr: Number,
    required: true,
    unique: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  maidenName: { typr: String },
  age: { type: Number },
  gender: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  birthDate: { type: String },
  image: { type: String },
  bloodGroup: { type: String },
  height: { type: Number },
  weight: { type: Number },
  eyeColor: { type: String },
  hair: {
    color: { type: String },
    type: { type: String },
  },
  ip: { type: String },
  address: { type: objectId, ref: "Address" },
  macAddress: { type: String },
  university: { type: String },
  bank: { type: objectId, ref: "Bank" },
  company: { type: objectId, ref: "Company" },
  ein: { type: String },
  ssn: { type: String },
  userAgent: { type: String },
  crypto: {
    coin: { type: String },
    wallet: { type: String },
    network: { type: String },
  },
  role: { type: String },
});

const UserModel = new mongoose.model("User", userSchema, "users");

module.exports = { getAllUsers, getUserByID, addNewUser, UserModel };
