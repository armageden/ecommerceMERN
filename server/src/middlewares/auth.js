const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccesKey } = require("../secret");
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw createError(401, "Access token not found!!");
    }
    const decoded = jwt.verify(token, jwtAccesKey);
    if (!decoded) {
      throw createError(401, "Invalid access token!! Please login again");
    }
    req.body.userId = decoded._id;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn };
