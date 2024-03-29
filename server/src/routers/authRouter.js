const express = require("express");
const { runValidation } = require("../validators");
const { handelLogin, handelLogout } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");


const authRouter = express.Router();
authRouter.post("/login",isLoggedOut, handelLogin)
authRouter.post("/logout",isLoggedIn, handelLogout)

module.exports = authRouter;
