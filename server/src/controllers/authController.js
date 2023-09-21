const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtAccesKey } = require("../secret");
const handelLogin = async (req, res, next) => {
  try {
    // email,password req.body
    const { email, password } = req.body;
    // check the user existance
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User doesn't exit with this email. Please register an account"
      );
    }
    // compare password for auth
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "The password is incorrect!!");
    }
    // check if banned
    if (user.isBanned) {
      throw createError(
        403,
        "This account is banned!! If you have questions then, please contact admin"
      );
    }
    // token,cookie

    //create jwt
    const accessToken = createJsonWebToken(
      { _id: user._id },
      jwtAccesKey,
      "10m"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, //15 min
      httpOnly: true,
      //secure: true,
      sameSite: "none",
    });
    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "Users loggedin",
      payload: {
        User,
      },
    });
  } catch (error) {
    next(error);
  }
};
const handelLogout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "User loggedout",
      payload: {
        User,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { handelLogin, handelLogout };
