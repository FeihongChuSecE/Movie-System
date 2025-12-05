const express = require("express");
const router = express.Router();
const { Router } = require("express");

const { UserModel } = require("./users-model");
const { readFile } = require("../../shared/file-utils");
const path = require("path");

const usersFilePath = path.join(__dirname, "../../data/users.json");

const { createUserRules } = require("./middlewares/create-user-rules");
const checkValidation = require("../../shared/middlewares/check-validation");
const registerRules = require("./middlewares/register-rules");
const loginRules = require("./middlewares/login-rules");
const authorize = require("../../shared/middlewares/authorize");
const { matchPassword, encodePassword } = require("../../shared/password-utils");
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

const usersRoute = Router();
usersRoute.post("/register", registerRules, async (req, res) => {
  const lang = req.cookies.lang || "EN";
  const newUser = req.body;
  const existingUser = await UserModel.findOne({ email: newUser.email });
  if (existingUser) {
    return res.status(500).json({
      errorMessage:
        lang === "FR"
          ? `L'utilisateur avec ${newUser.email} existe déjà.`
          : `User with ${newUser.email} already exist`,
    });
  }
  const addedUser = await UserModel.create(newUser);
  if (!addedUser) {
    return res.status(500).send({
      errorMessage:
        lang === "FR"
          ? `Oups ! Impossible d'ajouter l'utilisateur !`
          : `Oops! User couldn't be added!`,
    });
  }
  const user = { ...addedUser.toJSON(), password: undefined };
  res.json(user);
});

usersRoute.post("/login", loginRules, async (req, res) => {
  const lang = req.cookies?.lang || "EN";
  const { email, password } = req.body;

  try {
    let foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      // Auto-register new user
      const newUserData = {
        email,
        password: encodePassword(password), // Hash password before saving
        firstName: email.split('@')[0], // Use email prefix as name
        username: email.split('@')[0],
        role: "user"
      };

      foundUser = await UserModel.create(newUserData);
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

    const user = { ...foundUser.toJSON(), password: undefined };
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
