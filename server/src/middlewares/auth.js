const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccesKey } = require("../secret");
const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createError(401, "Access token not found!!");
    }
    const decoded = jwt.verify(accessToken, jwtAccesKey);
    if (!decoded) {
      throw createError(401, "Invalid access token!! Please login again");
    }
    console.log(decoded)
    next();
  } catch (error) {
    return next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      throw createError(400, "User is already logged in!!");
    }

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut };
