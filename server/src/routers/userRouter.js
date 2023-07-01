const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/userControl");
const userRouter = express.Router();

// /api/users
userRouter.get("/", getUsers);
userRouter.post("/process-register", processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
