const express = require("express");
const { runValidation } = require("../validators");
const handelLogin = require("../controllers/authController");

const authRouter = express.Router();
authRouter.post("/login",handelLogin)

module.exports = authRouter;
