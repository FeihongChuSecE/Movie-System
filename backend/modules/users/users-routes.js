const express = require("express");
const router = express.Router();
const { Router } = require("express");

const { UserModel } = require("./users-model");
const { readFile, writeToFile } = require("../../shared/file-utils");
const { encodePassword, matchPassword } = require("../../shared/password-utils");
const path = require("path");

const usersFilePath = path.join(__dirname, "../../data/users.json");

const { createUserRules } = require("./middlewares/create-user-rules");
const checkValidation = require("../../shared/middlewares/check-validation");
const registerRules = require("./middlewares/register-rules");
const loginRules = require("./middlewares/login-rules");
const authorize = require("../../shared/middlewares/authorize");
const { encodeToken } = require("../../shared/jwt-utils");

//get /users/:id get a sigle user by id
router.get("/:id", async (req, res, next) => {
  try {
    //get all the id
    const userID = req.params.id;
    const user = await UserModel.findById(userID)
      .select("firstName lastName email phone username")
      .sort({ createdAt: -1 });
    //error
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    //success return the sigle user
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//post /users add a new user
router.post("/", createUserRules, checkValidation, async (req, res, next) => {
  try {
    const newUser = await UserModel.create(req.body);
    res.json(newUser); //return new user
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// File-based user storage helpers
async function findUserFileBased(email) {
  try {
    const users = await readFile(usersFilePath);
    return users.find(user => user.email === email);
  } catch (error) {
    return null;
  }
}

async function createUserFileBased(newUser) {
  console.log("Creating user with file-based storage:", newUser.email);
  let users = [];
  try {
    users = await readFile(usersFilePath);
    console.log("Loaded existing users:", users.length);
  } catch (error) {
    console.log("Users file doesn't exist, starting with empty array");
    users = [];
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === newUser.email);
  if (existingUser) {
    console.log("User already exists:", newUser.email);
    throw new Error("User already exists");
  }

  // Create new user with hashed password
  const hashedPassword = encodePassword(newUser.password);
  const userToAdd = {
    ...newUser,
    password: hashedPassword,
    id: Date.now(),
    role: "user",
    createdAt: new Date().toISOString()
  };

  // Remove password from response
  const { password, ...userResponse } = userToAdd;

  users.push(userToAdd);
  console.log("Writing users to file:", users.length, "users");
  await writeToFile(usersFilePath, users);
  console.log("User created successfully");

  return userResponse;
}

const usersRoute = Router();
usersRoute.post("/register", async (req, res) => {
  const lang = req.cookies.lang || "EN";
  const newUser = req.body;

  console.log("Registration request received:", newUser);

  try {
    // Try MongoDB first
    console.log("Trying MongoDB...");
    const existingUser = await UserModel.findOne({ email: newUser.email });
    if (existingUser) {
      console.log("User exists in MongoDB");
      return res.status(409).json({
        errorMessage:
          lang === "FR"
            ? `L'utilisateur avec ${newUser.email} existe déjà.`
            : `User with ${newUser.email} already exist`,
      });
    }
    const addedUser = await UserModel.create(newUser);
    if (!addedUser) {
      throw new Error("MongoDB creation failed");
    }
    const user = { ...addedUser.toJSON(), password: undefined };
    console.log("User created in MongoDB");
    res.json(user);
  } catch (mongoError) {
    console.log("MongoDB failed, trying file-based:", mongoError.message);
    // Fallback to file-based storage
    try {
      const user = await createUserFileBased(newUser);
      console.log("User created with file-based storage");
      res.json(user);
    } catch (fileError) {
      console.log("File-based creation failed:", fileError.message);
      const statusCode = fileError.message === "User already exists" ? 409 : 500;
      return res.status(statusCode).json({
        errorMessage:
          lang === "FR"
            ? `Erreur lors de l'inscription: ${fileError.message}`
            : `Registration error: ${fileError.message}`,
      });
    }
  }
});

usersRoute.post("/login", loginRules, async (req, res) => {
  const lang = req.cookies?.lang || "EN";
  const { email, password } = req.body;

  try {
    // Try MongoDB first
    let foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      // Fallback to file-based storage
      foundUser = await findUserFileBased(email);
    }

    if (!foundUser) {
      return res.status(401).send({
        errorMessage:
          lang === "FR"
            ? "L'adresse e-mail et le mot de passe ne correspondent pas."
            : `Email and password didn't match`,
      });
    }

    const passwordMatched = matchPassword(password, foundUser.password);

    if (!passwordMatched) {
      return res.status(401).send({
        errorMessage:
          lang === "FR"
            ? "L'adresse e-mail et le mot de passe ne correspondent pas."
            : `Email and password didn't match`,
      });
    }

    const user = { ...foundUser, password: undefined };
    const token = encodeToken(user);

    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

usersRoute.get("/users/:id", authorize, async (req, res) => {
  const lang = req.cookies.lang || "EN";
  const userID = req.params.id;
  if (userID !== req.user?._id) {
    return res.status(401).json({
      errorMessage:
        lang === "FR"
          ? "Vous n'êtes pas autorisé à accéder à cette ressource."
          : "You don't have permission to access this resource",
    });
  }
  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res.status(404).json({
      errorMessage:
        lang === "FR"
          ? `L'utilisateur avec ${userID} n'existe pas.`
          : `User with ${userID} doesn't exist`,
    });
  }
  res.json(foundUser);
});
module.exports = { router, usersRoute };
