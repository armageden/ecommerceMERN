const createError = require("http-errors");
const User = require("../models/usermodel");
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");
const {findWithId } = require("../services/findItem");

const getUsers = async (req, res, next) => {
  try {
    return successResponse(res, {
      statusCode: 200,
      message: "Users are returned",
      payload: {
        User,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user =await findWithId(id,options);
    return successResponse(res, {
      statusCode: 200,
      message: "User is returned",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getUsers, getUser };
