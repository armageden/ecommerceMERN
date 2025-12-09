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
// Controller to manage user status (ban/unban)
// Only admin can access this
const handleManageUserStatusById = async (req, res, next) => {
  try {
    // Get user ID from request parameters
    const userId = req.params.id;

    // Get the action (ban or unban) from request body
    const action = req.body.action;

    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, throw error
    if (!user) {
      throw createError(404, "User not found");
    }

    // Update the user status based on action
    if (action === "ban") {
      user.isBanned = true;
    } else if (action === "unban") {
      user.isBanned = false;
    } else {
      throw createError(400, "Invalid action. Use 'ban' or 'unban'");
    }

    // Save the updated user to database
    await user.save();

    // Return success response
    return successResponse(res, {
      statusCode: 200,
      message: `User was ${action}ned successfully`,
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update logged-in user's profile
const handleUpdateProfile = async (req, res, next) => {
  try {
    // Get the logged-in user's ID from the request object (set by isLoggedIn middleware)
    const userId = req.user._id;

    // Prepare the update object
    const updates = {};

    // List of allowed fields to update
    const allowedFields = ["name", "phone", "address"];

    // Loop through the request body and add allowed fields to updates object
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    // Handle image upload if present
    const image = req.file;
    if (image) {
      // Check image size (max 2MB)
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "Image file is too large! Maximum allowed size is 2 MB");
      }
      // Convert image buffer to base64 string
      updates.image = image.buffer.toString("base64");
    }

    // Update the user in the database
    // { new: true } returns the updated document
    // { runValidators: true } ensures schema validation rules are applied
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from the result

    if (!updatedUser) {
      throw createError(404, "User not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Profile updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get logged-in user's profile
const handleGetUserProfile = async (req, res, next) => {
  try {
    // Get the logged-in user's ID
    const userId = req.user._id;

    // Find the user and exclude the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw createError(404, "User not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User profile returned successfully",
      payload: { user },
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
  handleManageUserStatusById,
  handleUpdateProfile,
  handleGetUserProfile,
};
