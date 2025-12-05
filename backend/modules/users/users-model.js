const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { encodePassword } = require("../../shared/password-utils");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now() },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = encodePassword(this.password);
    return next();
  } catch (err) {
    return next(err);
  }
});

const UserModel = mongoose.model("User", userSchema, "users");

module.exports = { UserModel };
