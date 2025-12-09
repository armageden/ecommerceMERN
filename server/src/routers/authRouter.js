const express = require("express");
const { runValidation } = require("../validators");
const {
    handelLogin,
    handelLogout,
    handleForgetPassword,
    handleResetPassword,
    handleUpdatePassword,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const {
    validateUserForgetPassword,
    validateUserResetPassword,
    validateUserPasswordUpdate,
    validateUserSignIn,
} = require("../validators/auth");

const authRouter = express.Router();
authRouter.post("/login", validateUserSignIn, runValidation, isLoggedOut, handelLogin);
authRouter.post("/logout", isLoggedIn, handelLogout);
authRouter.post(
    "/forget-password",
    validateUserForgetPassword,
    runValidation,
    isLoggedOut,
    handleForgetPassword
);
authRouter.post(
    "/reset-password",
    validateUserResetPassword,
    runValidation,
    isLoggedOut,
    handleResetPassword
);
authRouter.put(
    "/change-password",
    validateUserPasswordUpdate,
    runValidation,
    isLoggedIn,
    handleUpdatePassword
);

module.exports = authRouter;
