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
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");

const userRouter = express.Router();

// /api/users
userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validatUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/activate", isLoggedOut,activateUserAccount);
userRouter.get("/", isLoggedIn, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);

module.exports = userRouter;
