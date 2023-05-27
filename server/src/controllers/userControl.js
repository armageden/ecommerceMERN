const createError = require("http-errors");

const getprofile = (req, res, next) => {
  try {
    console.log(req.body.id);
    res.status(200).send("User profile is returned", { Profiles: profile });
  } catch (error) {
    next(error);
  }
};
module.exports = { getprofile };
