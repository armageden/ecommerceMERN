const createError = require("http-errors");
const fs = require("fs").promises;
const User = require("../models/usermodel");
const { successResponse } = require("./responseController");

const { findWithId } = require("../services/findItem");
const { error } = require("console");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp("*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { regex: searchRegExp } },
        { email: { regex: searchRegExp } },
        { phone: { regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();
    if (!users) throw createError(404, "no users found");

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

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findWithId(User, id, options);
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

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "User was Deleted",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists..Please sign in"
      );
    }

    // Create Json web token...
    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    // Prepare email
    const emailData = {
      email,
      subject: "Account Activation Mail",
      html: `
        <h2> Hello ${name} ! </h2> 
        <p> Please click here to <a href="${clientURL}/api/users/activate${token}" target="_blank">activate</a></p>       
        `,
    };

    //send email with nodemailer

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
      return;
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Check your email to verify your account !",
      payload: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
const activateUserAccount = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists..Please sign in"
      );
    }

    // Create Json web token...
    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    // Prepare email
    const emailData = {
      email,
      subject: "Account Activation Mail",
      html: `
        <h2> Hello ${name} ! </h2> 
        <p> Please click here to <a href="${clientURL}/api/users/activate${token}" target="_blank">activate</a></p>       
        `,
    };

    //send email with nodemailer

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
      return;
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Check your email to verify your account !",
      payload: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUsers,
  getUserById,
  activateUserAccount,
  deleteUserById,
  processRegister,
};
