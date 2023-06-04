const createError = require("http-errors");
const fs = require("fs");
const User = require("../models/usermodel");
const { successResponse } = require("./responseController");

const { findWithId } = require("../services/findItem");
const { error } = require("console");

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
    const user = await findWithId(id, options);
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

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(id, options);
    const deletedUser=await User.findByIdAndDelete({_id:id,isAdmin:false})
    const userImagePath = user.image;
    fs.access(userImagePath, (err) => {
      if (err) {
        console.error("user does not exist!");f
      } else {
        fs.unlink(userImagePath, (err) => {
          if (error) {
            throw err;
          }
          console.log("user image was deleted");
        });
      }
    });
    return successResponse(res, {
      statusCode: 200,
      message: "User is Deleted",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getUsers, getUser, deleteUser };
