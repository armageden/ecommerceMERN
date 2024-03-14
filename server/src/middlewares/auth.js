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
    req.user = decoded.user;
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
const isAdmin = async (req, res, next) => {
  try {
    console.log("reg.user =" + req.user);
    if (!req.user.isAdmin){
      throw createError(403, "Forbidden. You must be an admin to access the resource")
    }
    next();
  } catch (error) {
    return next(error);
  }
};
module.exports = { isLoggedIn, isLoggedOut, isAdmin };
