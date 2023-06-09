const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/userControl");
const userRouter = express.Router();

// /api/users
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
