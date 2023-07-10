const createError = require("http-errors");
const jwt = require("jsonwebtoken");
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
    const options = { password: 0 };
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
    const image = req.file;
    if (!image) {
      throw createError(400, "image file is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(
        400,
        "image file is too large! Maximum allowed size is 2 MB"
      );
    }
    const imageBufferString = image.buffer.toString("base64");

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists..Please sign in"
      );
    }

    // Create Json web token...
    const token = createJsonWebToken(
      { name, email, password, phone, address, image: imageBufferString },
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
    const token = req.body.token;
    if (!token) {
      throw createError(404, "token not found");
    }
    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) {
        throw createError(401, "User was not verified !");
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User account was registered !",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "image file is too large! Maximum allowed size is 2 MB"
        );
      }
      updates.image = image.buffer.toString("base64");
    }
   // delete updates.email;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User with this id doesn't exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was Updated",
      payload: updatedUser,
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
  updateUserById,
};
