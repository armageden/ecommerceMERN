const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/userControl");
const { upload } = require("../middlewares/uploadFiles");

const userRouter = express.Router();

// /api/users
userRouter.post("/process-register",upload.single("image"), processRegister);
userRouter.get("/", getUsers);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
