const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
} = require("../controllers/userControl");
const { upload } = require("../middlewares/uploadFiles");
const { validatUserRegistration } = require("../validators/auth");
const { runValidation } = require("../validators");

const userRouter = express.Router();

// /api/users
userRouter.post(
  "/process-register",
  upload.single("image"),
  validatUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/:id",upload.single("image"), updateUserById);

module.exports = userRouter;
