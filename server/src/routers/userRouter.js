const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleManageUserStatusById,
  handleUpdateProfile,
  handleGetUserProfile,
} = require("../controllers/userControl");
const { upload } = require("../middlewares/uploadFiles");
const { validatUserRegistration } = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

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
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
// Route to update user profile (Logged in user only)
userRouter.put("/update-profile", upload.single("image"), isLoggedIn, handleUpdateProfile);

// Route to get user profile (Logged in user only)
userRouter.get("/profile", isLoggedIn, handleGetUserProfile);

// Route to manage user status (ban/unban) - Admin only
userRouter.put("/manage-user/:id", isLoggedIn, isAdmin, handleManageUserStatusById);

userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);

module.exports = userRouter;
