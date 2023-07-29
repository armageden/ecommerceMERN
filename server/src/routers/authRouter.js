const express = require("express");
const { runValidation } = require("../validators");
const { handelLogin, handelLogout } = require("../controllers/authController");


const authRouter = express.Router();
authRouter.post("/login",handelLogin)
authRouter.post("/logout",handelLogout)

module.exports = authRouter;
