const express = require("express");
const router = express.Router();

const { getUserByID } = require("./users-model");

//get /users/:id get a sigle user by id
router.get("/:id", async (req, res, next) => {
  try {
    //get all the id
    const userID = req.params.id;
    const user = await getUserByID(userID);
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
    const newUser = await addNewUser(req.body);
    res.json(newUser); //return new user
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
